'use strict';

var normalizeReadArgs = require('../util/normalizeReadArgs');
var normalizedRead = require('../util/normalizedRead');

module.exports = readAsyncMethod;

/**
 * This plugin defines the {@link JsonSchemaLib#readSync}s method.
 *
 * @param {JsonSchemaLib} jsonSchemaLib - The {@link JsonSchemaLib} instance to apply the plugin to
 * @param {JsonSchemaLib} api.JsonSchemaLib - The {@link JsonSchemaLib} class
 */
function readAsyncMethod (jsonSchemaLib, api) {
  var JsonSchemaLib = api.JsonSchemaLib;
  JsonSchemaLib.prototype.readSync = readSync;
}

/**
 * Synchronously reads the given file, URL, or data, including any other files or URLs that are
 * referneced by JSON References ($ref).
 *
 * @param {string} [url]
 * The file path or URL of the JSON schema
 *
 * @param {object|string} [data]
 * The JSON schema, as an object, or as a JSON/YAML string. If you omit this, then the data will
 * be read from `url` instead.
 *
 * @param {Config} [config]
 * Config that determine how the schema will be read
 *
 * @param {function} [callback]
 * An error-first callback. If not specified, then the {@link Schema} will be returned.
 *
 * @returns {Schema|undefined}
 *
 * @this {JsonSchemaLib}
 */
function readSync (url, data, config, callback) {
  var args = normalizeReadArgs(arguments, this.config);
  var error = args.error;
  url = args.url;
  data = args.data;
  config = args.config;
  callback = args.callback;

  // Set this flag to indicate that we're operating synchronously
  config.sync = true;

  if (error) {
    // The arguments are invalid
    if (callback) {
      callback(error);
    }
    else {
      throw error;
    }
  }
  else if (callback) {
    try {
      // Call the method with a synchronous callback
      normalizedRead.call(this, url, data, config, callback);
    }
    catch (err) {
      // The method threw an error, so forward it to the callback
      callback(err);
    }
  }
  else {
    var e, s;

    try {
      // Call the method and capture the result
      normalizedRead.call(this, url, data, config, function (err, schema) {
        e = err;
        s = schema;
      });
    }
    catch (err) {
      // The method threw an error, so capture it
      e = err;
    }

    // Return the result synchronously
    if (e) {
      throw e;
    }
    else {
      return s;
    }
  }
}
