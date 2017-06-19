'use strict';

module.exports = typeOf;

/**
 * Returns information about the type of the given value
 *
 * @param {*} value
 * @returns {{ hasValue: boolean, isArray: boolean, isPOJO: boolean }}
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
