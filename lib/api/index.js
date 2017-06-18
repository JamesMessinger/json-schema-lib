'use strict';

var JsonSchemaLib = require('./JsonSchemaLib');

// Export the default instance of JsonSchemaLib
module.exports = createJsonSchemaLib();

// Allow ES6 default import syntax (for Babel, TypeScript, etc.)
module.exports.default = module.exports;

// Factory for creating multiple JsonSchemaLib instances
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
