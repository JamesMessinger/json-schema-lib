'use strict';

var ono = require('ono');

module.exports = promiseConfig;

/**
 * This plugin determines whether the current runtime environment supports Promises.
 * It creates a {@link Config#Promise} property, which other plugins can use rather than
 * assuming that the `Promise` global exists.
 *
 * This also allows users to set the {@link Config#Promise} property to a custom Promise
 * implementation.
 *
 * @param {JsonSchemaLib} jsonSchemaLib - The {@link JsonSchemaLib} instance to apply the plugin to
 */
function promiseConfig (jsonSchemaLib) {
  if (typeof Promise === 'function') {
    jsonSchemaLib.config.Promise = Promise;
  }
  else {
    jsonSchemaLib.config.Promise = function PromiseNotSupported () {
      throw ono('This browser does not support Promises. Please use a callback instead.');
    };
  }
}
