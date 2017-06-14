/* eslint no-unused-vars:off */
'use strict';

var Config = require('../Config');
var Schema = require('../Schema');
var callSync = require('./callSync');
var callAsync = require('./callAsync');

module.exports = JsonSchemaLib;

/**
 * The public JSON Schema Lib API.
 *
 * @param {Config} [config]
 * @class
 */
function JsonSchemaLib (config) {
  this.config = new Config(config);
}

JsonSchemaLib.prototype.parse = function (url, data, config, callback) {
  return callAsync(this, parse, arguments);
};

JsonSchemaLib.prototype.parseSync = function (url, data, config, callback) {
  return callSync(this, parse, arguments);
};

/**
 * Synchronously reads the given file, URL, or data, and parses it to produce a {@link Schema} object.
 *
 * Any JSON References ($ref) in the parsed file are NOT followed, so the returned {@link Schema}
 * will only be one level deep.
 *
 * @param {string} [url]
 * The file path or URL of the JSON schema
 *
 * @param {object|string} [data]
 * The JSON schema, as an object, or as a JSON/YAML string. If you omit this, then the data will
 * be downloaded from `url` instead.
 *
 * @param {Config} [config]
 * Config that determine how JSON Schema Lib will behave
 *
 * @param {function} [callback]
 * An error-first callback. If not specified, then the {@link Schema} will be returned.
 *
 * @returns {Schema|undefined}
 */
function parse (url, data, config, callback) {
  var schema = new Schema();

  var rootFile = plugins.resolve({
    url: url,
    data: data,
    schema: this,
  });

  schema.files.push(rootFile);
}
