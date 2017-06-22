'use strict';

var Schema = require('../Schema');
var File = require('../File');
var safeCall = require('../../util/safeCall');
var stripHash = require('../../util/stripHash');

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
  var schema = new Schema(config, this.plugins);
  var rootFile = new File(schema);
  schema.files.push(rootFile);

  if (url) {
    // Resolve the user-supplied URL to an absolute URL
    url = schema.plugins.resolveURL(null, url);

    // Remove any hash from the URL, since this URL represents the WHOLE file, not a fragment of it
    rootFile.url = stripHash(url);
  }

  if (data) {
    // No need to read the file, because its data was passed-in
    rootFile.data = data;
    doneReading(null);
  }
  else {
    // Read/download the file
    safeCall(readFile, rootFile, schema, doneReading);
  }

  function doneReading (err) {
    callback(err, schema);
  }
}

function readFile (file, schema, callback) {
  callback();
}

