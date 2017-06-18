'use strict';

module.exports = normalizedRead;

/**
 * This is the normalized implementation of {@link JsonSchemaLib#readAsync} and {@link JsonSchemaLib#readSync}.
 * It reads the given file, URL, or data, including any other files or URLs that are referneced
 * by JSON References ($ref).
 *
 * @param {string} url
 * @param {object|string|undefined} data
 * @param {Config} config
 * @param {function} callback
 *
 * @this JsonSchemaLib
 */
function normalizedRead (url, data, config, callback) {
  var schema = new Schema(config)



  var rootFile = new File(url, data, state);
  schema.files.push(rootFile);
}
