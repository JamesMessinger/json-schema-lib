'use strict';

var JsonSchemaLib = require('./JsonSchemaLib');

// Export the default instance of JsonSchemaLib
module.exports = new JsonSchemaLib();

// Allow ES6 default import syntax (for Babel, TypeScript, etc.)
module.exports.default = module.exports;

// Factory for creating multiple JsonSchemaLib instances
module.exports.create = function (config) {
  return new JsonSchemaLib(config);
};
