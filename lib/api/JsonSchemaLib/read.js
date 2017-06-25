'use strict';

var Schema = require('../Schema');
var File = require('../File');
var safeCall = require('../../util/safeCall');
var stripHash = require('../../util/stripHash');
var typeOf = require('../../util/typeOf');
var __internal = require('../../util/internal');

var STATE_READING = 1;
var STATE_READ = 2;

module.exports = read;

/**
 * Reads the given file, URL, or data, including any other files or URLs that are referneced
 * by JSON References ($ref).
 *
 * @param {string} url
 * @param {object|string|undefined} data
 * @param {Config} config
 * @param {function} callback
 *
 * @this JsonSchemaLib
 */
function read (url, data, config, callback) {
  // Create a new JSON Schema and root file
  var schema = new Schema(config, this.plugins.toJSON());
  var rootFile = new File(schema);
  schema.files.push(rootFile);

  if (url) {
    // Resolve the user-supplied URL to an absolute URL
    url = schema.plugins.resolveURL({ to: url });

    // Remove any hash from the URL, since this URL represents the WHOLE file, not a fragment of it
    rootFile.url = stripHash(url);
  }

  if (data) {
    // No need to read the file, because its data was passed-in
    rootFile.data = data;
    rootFile[__internal].state = STATE_READ;
    safeCall(parseFile, rootFile, callback);
  }
  else {
    // Read/download the file
    safeCall(readFile, rootFile, callback);
  }
}

/**
 * Reads the given file from its source (e.g. web server, filesystem, etc.)
 *
 * @param {File} file
 * @param {function} callback
 */
function readFile (file, callback) {
  var schema = file.schema;
  file[__internal].state = STATE_READING;

  if (schema.config.sync) {
    schema.plugins.readFileSync({ file: file });
    doneReading();
  }
  else {
    schema.plugins.readFileAsync({ file: file, done: doneReading });
  }

  function doneReading (err) {
    if (err) {
      callback(err);
    }
    else {
      file[__internal].state = STATE_READ;
      safeCall(parseFile, file, callback);
    }
  }
}

/**
 * Parses the {@link File#data} property of the given file.
 *
 * @param {File} file
 * @param {function} callback
 */
function parseFile (file, callback) {
  file.schema.plugins.parseFile({ file: file });
  safeCall(resolveRefs, file, callback);
}

/**
 * Resolves all JSON References ($ref) in the given file, and adds any new files to the schema.
 *
 * @param {File} file
 * @param {function} callback
 */
function resolveRefs (file, callback) {
  if (typeOf(file.data).isPOJO) {
    // TODO: Resolve all $refs in the file. Add File objects to the schema
  }

  safeCall(readReferencedFiles, file.schema, callback);
}

/**
 * Reads any files in the schema that haven't been read yet.
 *
 * @param {Schema} schema
 * @param {function} callback
 */
function readReferencedFiles (schema, callback) {
  var filesBeingRead = [], filesToRead = [];
  var file, i;

  // Check the state of all files in the schema
  for (i = 0; i < schema.files.length; i++) {
    file = schema.files[i];

    if (file[__internal].state < STATE_READING) {
      filesToRead.push(file);
    }
    else if (file[__internal].state < STATE_READ) {
      filesBeingRead.push(file);
    }
  }

  // Have we finished reading everything?
  if (filesToRead.length === 0 && filesBeingRead.length === 0) {
    return callback(null, schema);
  }

  // Start reading any files that haven't been read yet
  for (i = 0; i < filesToRead.length; i++) {
    file = filesToRead[i];
    safeCall(readFile, file, callback);
  }
}
