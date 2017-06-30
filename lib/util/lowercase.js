'use strict';

module.exports = lowercase;

/**
 * Returns the given string in lowercase.
 * If the value is not a string, then it is returned as-is.
 *
 * @param {*} str
 * @returns {*}
 */
function lowercase (str) {
  if (str && typeof str === 'string') {
    return str.toLowerCase();
  }
  else {
    return str;
  }
}
