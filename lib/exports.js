'use strict';

var JsonSchemaLib = require('./api/JsonSchemaLib');
var Schema = require('./api/Schema');
var File = require('./api/File');

/**
 * The default instance of {@link JsonSchemaLib}
 *
 * @type {JsonSchemaLib}
 */
module.exports = createJsonSchemaLib();

/**
 * Allows ES6 default import syntax (for Babel, TypeScript, etc.)
 *
 * @type {JsonSchemaLib}
 */
module.exports.default = module.exports;

/**
 * Creates a new instance of {@link JsonSchemaLib} and initializes its configuration
 *
 * @param {Config} [config]
 * @returns {JsonSchemaLib}
 */
module.exports.create = createJsonSchemaLib;

/**
 * Creates an instance of JsonSchemaLib and initializes its configuration
 *
 * @param {Config} [config]
 * @returns {JsonSchemaLib}
 */
function createJsonSchemaLib (config) {
  return new JsonSchemaLib(config);
}

/**
 * Utility methods for plugin developers
 */
module.exports.util = {
  /**
   * Determines whether the given value is a {@link Schema} object
   *
   * @param {*} value
   * @returns {boolean}
   */
  isSchema: function isSchema (value) {
    return value instanceof Schema;
  },

  /**
   * Determines whether the given value is a {@link File} object
   *
   * @param {*} value
   * @returns {boolean}
   */
  isFile: function isFile (value) {
    return value instanceof File;
  },
};
