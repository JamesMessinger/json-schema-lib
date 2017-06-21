'use strict';

var Schema = require('../Schema');

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
  var schema = new Schema(config, this.plugins);

  var rootFile = schema.addFile(url, data);

  // TODO

  callback(null, schema);
}
