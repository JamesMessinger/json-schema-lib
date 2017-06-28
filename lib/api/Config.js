'use strict';

var ono = require('ono');
var typeOf = require('../util/typeOf');
var deepAssign = require('../util/deepClone').assign;

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
  Promise: require('../util/Promise'),

  /**
   * Options for downloading files via HTTP and HTTPS.
   * These options are used by the HttpPlugin and the XhrPlugin.
   */
  http: {
    /**
     * HTTP headers to send when making HTTP requests.
     */
    headers: {},

    /**
     * The maximum amount of time (in milliseconds) to wait for an HTTP response.
     *
     * @type {number}
     */
    timeout: 5000,

    /**
     * The maximum number of HTTP redirects to follow.
     * If set to zero, then no redirects will be followed.
     *
     * @type {number}
     */
    maxRedirects: 5,
  },
};

/**
 * Ensures that a user-supplied value is a valid configuration POJO.
 * An error is thrown if the value is invalid.
 *
 * @param {*} config - The user-supplied value to validate
 */
function validateConfig (config) {
  var type = typeOf(config);

  if (type.hasValue && !type.isPOJO) {
    throw ono('Invalid arguments. Expected a configuration object.');
  }
}
