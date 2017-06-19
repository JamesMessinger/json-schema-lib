'use strict';

var typeOf = require('./typeOf');

module.exports = deepAssign;

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
