'use strict';

var normalizeReadArgs = require('../util/normalizeReadArgs');
var normalizedRead = require('../util/normalizedRead');

module.exports = readAsyncMethod;

/**
 * This plugin defines the {@link JsonSchemaLib#readAsync}s method
 * (also aliased as {@link JsonSchemaLib#read}).
 *
 * @param {JsonSchemaLib} jsonSchemaLib - The {@link JsonSchemaLib} instance to apply the plugin to
 * @param {JsonSchemaLib} api.JsonSchemaLib - The {@link JsonSchemaLib} class
 */
function readAsyncMethod (jsonSchemaLib, api) {
  var JsonSchemaLib = api.JsonSchemaLib;
  JsonSchemaLib.prototype.readAsync = readAsync;
  JsonSchemaLib.prototype.read = readAsync;
}

/**
 * Asynchronously reads the given file, URL, or data, including any other files or URLs that are
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
 * An error-first callback. If not specified, then a Promise will be returned.
 *
 * @returns {Promise<Schema>|undefined}
 *
 * @this {JsonSchemaLib}
 */
function readAsync (url, data, config, callback) {
  var args = normalizeReadArgs(arguments, this.config);
  var error = args.error;
  url = args.url;
  data = args.data;
  config = args.config;
  callback = args.callback;

  // Set this flag to indicate that we're operating asynchronously
  config.sync = false;

  if (error) {
    // The arguments are invalid
    if (callback) {
      callAsync(callback, error);
    }
    else {
      return config.Promise.reject(error);
    }
  }
  else if (callback) {
    try {
      // Call the the method, and forward the result to the callback
      normalizedRead.call(this, url, data, config, function (err, schema) {
        callAsync(callback, err, schema);
      });
    }
    catch (err) {
      // The method threw an error, so forward it to the callback
      callAsync(callback, err);
    }
  }
  else {
    // Wrap the method in a Promise
    return new config.Promise(function (resolve, reject) {
      normalizedRead.call(this, url, data, config, function (err, schema) {
        if (err) {
          reject(err);
        }
        else {
          resolve(schema);
        }
      });
    });
  }
}

/**
 * Calls the callback function, wrapping it in a `setTimeout` to ensure that it's not
 * called synchronously.
 *
 * @param {function} fn
 * @param {Error} [error]
 * @param {Schema} [schema]
 */
function callAsync (fn, error, schema) {
  setTimeout(function () {
    fn(error, schema);
  }, 0);
}
