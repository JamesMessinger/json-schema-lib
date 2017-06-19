'use strict';

var ono = require('ono');
var typeOf = require('../../util/typeOf');

module.exports = validatePriority;

/**
 * Ensures that a user-supplied value is a valid plugin priority.
 * An error is thrown if the value is invalid.
 *
 * @param {*} priority - The user-supplied value to validate
 * @returns {object} - Returns the priority number, if valid
 */
function validatePriority (priority) {
  var type = typeOf(priority);

  if (type.hasValue) {
    if (type.isNumber) {
      // Any number is a valid priority (even zero, negative, infinity)
      return priority;
    }
    else {
      throw ono('Invalid arguments. Expected a priority number.');
    }
  }
}
