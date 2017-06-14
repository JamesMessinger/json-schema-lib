'use strict';

var Config = require('./api/Config');

// Set the default config for Node.js
Config.defaults.Promise = Promise;

module.exports = require('./api/JsonSchemaLib/instance');
