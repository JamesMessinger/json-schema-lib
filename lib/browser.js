'use strict';

var ono = require('ono');
var Config = require('./api/Config');

// Set the default config for Node.js
if (typeof Promise === 'function') {
  Config.defaults.Promise = Promise;
}
else {
  Config.defaults.Promise = function PromiseNotSupported () {
    throw ono('This browser does not support Promises. Please use a callback instead.');
  };
}

module.exports = require('./api/JsonSchemaLib/instance');
