'use strict';

module.exports = safeCall;

/**
 * Calls the specified function with the given arguments, and ensures that any
 * errors are forwarded to the callback.
 *
 * @param {function} fn - The function to call
 * @param {...*} [args] - The arguments to pass to the function
 * @param {function} callback - The callback function
 */
function safeCall (fn, args, callback) {
  args = Array.prototype.slice.call(arguments, 1);
  callback = args[args.length - 1];

  try {
    fn.apply(null, args);
  }
  catch (err) {
    callback(err);
  }
}
