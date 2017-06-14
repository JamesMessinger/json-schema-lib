'use strict';

var normalizeArgs = require('./normalizeArgs');

module.exports = callSync;

/**
 * Calls a JSON Schema Lib method with normalized arguments, and returns its result synchronously.
 *
 * @param {JsonSchemaLib} context
 * @param {function} method
 * @param {Arguments} args
 */
function callSync (context, method, args) {
  args = normalizeArgs(args, context.config);

  var error = args.error;
  var url = args.url;
  var data = args.data;
  var config = args.config;
  var callback = args.callback;

  config.sync = true;

  if (error) {
    // The arguments are invalid
    if (callback) {
      callback(error);
    }
    else {
      throw error;
    }
  }
  else if (callback) {
    try {
      // Call the method with a synchronous callback
      method.call(context, url, data, config, callback);
    }
    catch (err) {
      // The method threw an error, so forward it to the callback
      callback(err);
    }
  }
  else {
    var e, s;

    try {
      // Call the method and capture the result
      method.call(context, url, data, config, function (err, schema) {
        e = err;
        s = schema;
      });
    }
    catch (err) {
      // The method threw an error, so capture it
      e = err;
    }

    // Return the result synchronously
    if (e) {
      throw e;
    }
    else {
      return s;
    }
  }
}
