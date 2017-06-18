'use strict';

var symbols = require('../util/symbols');

module.exports = Config;

/**
 * Config that determine how {@link JsonSchemaLib} behaves
 *
 * @param {object} [config] - User-specified config. These override the defaults.
 * @param {object} [defaults] - The default config
 *
 * @class
 */
function Config (config, defaults) {
  apply(this, defaults);
  apply(this, config);
}

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

      if (isMergeable(sourceSetting, key)) {
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
 * @param {*}  val
 * @param {string} [key]
 * @returns {Boolean}
 */
function isMergeable (val, key) {
  return val &&
    key !== symbols.__plugins &&
    (typeof val === 'object') &&
    !Array.isArray(val) &&
    !(val instanceof RegExp) &&
    !(val instanceof Date);
}
