'use strict';

var ono = require('ono');
var defaults = require('./defaults');

module.exports = Config;

/**
 * Config that determine how {@link JsonSchemaLib} behaves
 *
 * @param {object} [config] - User-specified config. These override the defaults.
 * @param {object} [defaultConfig] - The default config to use instead of defaults.js
 * @class
 */
function Config (config, defaultConfig) {
  applyConfig(this, defaultConfig || defaults);
  applyConfig(this, config);
}

/**
 * Applies the given configuration
 *
 * @param {Config} target - The {@link Config} object that we're populating
 * @param {?object} source - The config to apply
 */
function applyConfig (target, source) {
  var type = typeOf(source);

  if (type.isPOJO) {
    deepAssign(target, source);
  }
  else if (type.hasValue) {
    throw ono('Invalid arguments. Expected a configuration object.');
  }
}

/**
 * Deeply assigns the properties of the source object to the target object
 *
 * @param {object} target
 * @param {object} source
 */
function deepAssign (target, source) {
  var keys = Object.keys(source);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    target[key] = deepClone(source[key]);
  }
}

/**
 * Returns a deep clone of the given value
 *
 * @param {*} value
 * @returns {*}
 */
function deepClone (value) {
  var type = typeOf(value);

  if (type.isPOJO) {
    return deepAssign({}, value);
  }
  else if (type.isArray) {
    var clone = [];
    for (var i = 0; i < value.length; i++) {
      clone.push(deepClone(value[i]));
    }
  }
  else if (type.hasValue) {
    // string, boolean, number, function, Date, RegExp, etc.
    // Just return it as-is
    return value;
  }
}

/**
 * Returns information about the type of the given value
 *
 * @param {*} value
 * @returns {object}
 */
function typeOf (value) {
  var type = {
    hasValue: false,
    isArray: false,
    isPOJO: false,
  };

  if (value !== undefined && value !== null) {
    type.hasValue = true;

    if (Array.isArray(value)) {
      type.isArray = true;
    }
    else {
      type.isPOJO =
        (typeof value === 'object') &&
        !(value instanceof RegExp) &&
        !(value instanceof Date);
    }
  }

  return type;
}
