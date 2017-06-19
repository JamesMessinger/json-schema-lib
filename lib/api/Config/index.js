'use strict';

var validateConfig = require('./validateConfig');
var deepAssign = require('../../util/deepAssign');

module.exports = Config;

/**
 * Config that determine how {@link JsonSchemaLib} behaves
 *
 * @param {object} [config] - User-specified config. These override the defaults.
 * @param {object} [defaultConfig] - The default config to use instead of {@link Config.defaults}
 * @class
 */
function Config (config, defaultConfig) {
  validateConfig(config);
  deepAssign(this, defaultConfig || Config.defaults);

  if (config) {
    deepAssign(this, config);
  }
}

/**
 * The default configuration.
 */
Config.defaults = {
  /**
   * The Promise class to use when asynchronous methods are called without a callback.
   * Users can override this with a custom Promise implementation, such as Bluebird
   * or a polyfill.
   *
   * @type {function}
   */
  Promise: require('../../util/Promise'),
};
