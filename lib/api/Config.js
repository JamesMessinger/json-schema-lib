'use strict';

module.exports = Config;

/**
 * Config that determine how {@link JsonSchemaLib} behaves
 *
 * @param {object} [config] - User-specified config. These override the defaults.
 * @param {object} [defaults] - Default config. If not specified, defaults to {@link Config.defaults}
 * @class
 */
function Config (config, defaults) {
  apply(this, defaults || Config.defaults);
  apply(this, config);
}

/**
 * The default configuration.
 *
 * NOTE: Some of these defaults are overridden, depending on whether JsonSchemaLib is running
 * in a browser or in Node.js
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
};

/**
 * Applies the given configuration
 *
 * @param {Config} target - The {@link Config} object that we're populating
 * @param {?object} source - The config to apply
 * @returns {Config}
 */
function apply (target, source) {
  if (isMergeable(source)) {
    var keys = Object.keys(source);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var sourceSetting = source[key];
      var targetSetting = target[key];

      if (isMergeable(sourceSetting)) {
        // It's a nested object, so apply it recursively
        target[key] = apply(targetSetting || {}, sourceSetting);
      }
      else if (sourceSetting !== undefined) {
        // It's a scalar value, function, or array. No merging necessary. Just overwrite the target value.
        target[key] = sourceSetting;
      }
    }
  }

  return target;
}

/**
 * Determines whether the given value can be merged,
 * or if it is a scalar value that should just override the target value.
 *
 * @param   {*}  val
 * @returns {Boolean}
 */
function isMergeable (val) {
  return val &&
    (typeof val === 'object') &&
    !Array.isArray(val) &&
    !(val instanceof RegExp) &&
    !(val instanceof Date);
}
