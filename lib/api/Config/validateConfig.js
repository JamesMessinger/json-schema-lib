'use strict';

var ono = require('ono');
var typeOf = require('../../util/typeOf');

module.exports = validateConfig;

/**
 * Ensures that a user-supplied value is a valid configuration POJO.
 * An error is thrown if the value is invalid.
 *
 * @param {*} config - The user-supplied value to validate
 * @returns {object} - Returns the config object, if it's valid
 */
function validateConfig (config) {
  var type = typeOf(config);

  if (type.hasValue) {
    if (type.isPOJO) {
      // It's a valid config object
      return config;
    }
    else {
      throw ono('Invalid arguments. Expected a configuration object.');
    }
  }
}
