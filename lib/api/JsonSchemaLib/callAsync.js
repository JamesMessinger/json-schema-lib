'use strict';

var normalizeArgs = require('./normalizeArgs');

module.exports = callAsync;

/**
 * Calls a {@link JsonSchemaLib} method with normalized arguments, and returns its result asynchronously.
 *
 * @param {JsonSchemaLib} context
 * @param {function} method
 * @param {Arguments} args
 */
function callAsync (context, method, args) {
  args = normalizeArgs(args, context.config);

  var error = args.error;
  var url = args.url;
  var data = args.data;
  var config = args.config;
  var callback = args.callback;

  config.sync = false;

  if (error) {
    // The arguments are invalid
    if (callback) {
      call(callback, error);
    }
    else {
      return config.Promise.reject(error);
    }
  }
  else if (callback) {
    try {
      // Call the the method, and forward the result to the callback
      method.call(context, url, data, config, function (err, schema) {
        call(callback, err, schema);
      });
    }
    catch (err) {
      // The method threw an error, so forward it to the callback
      call(callback, err);
    }
  }
  else {
    // Wrap the method in a Promise
    return new config.Promise(function (resolve, reject) {
      method.call(context, url, data, config, function (err, schema) {
        if (err) {
          reject(err);
        }
        else {
          resolve(schema);
        }
      });
    });
  }
}

/**
 * Calls the callback function, wrapping it in a `setTimeout` to ensure that it's not
 * called synchronously.
 *
 * @param {function} fn
 * @param {Error} [error]
 * @param {Schema} [schema]
 */
function call (fn, error, schema) {
  setTimeout(function () {
    fn(error, schema);
  }, 0);
}
