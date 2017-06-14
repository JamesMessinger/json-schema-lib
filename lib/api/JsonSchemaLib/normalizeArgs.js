'use strict';

var ono = require('ono');
var Config = require('../Config');

module.exports = normalizeArgs;

/**
 * Normalizes the given arguments, accounting for optional args and default config.
 *
 * @param {Arguments} args
 * @param {Config} defaults
 * @returns {object}
 */
function normalizeArgs (args, defaults) {
  var error, url, data, config, callback;

  try {
    args = Array.prototype.slice.call(args);

    if (typeof args[args.length - 1] === 'function') {
      // The last parameter is a callback function
      callback = args.pop();
    }

    // If the first parameter is a string
    if (typeof args[0] === 'string' && args[0].trim()[0] !== '{' && args[0].indexOf('\n') === -1) {
      // The first parameter is the URL
      url = args[0];
      if (typeof args[2] === 'object') {
        // The second parameter is the JSON Schema, and the third parameter is the config
        data = args[1];
        config = args[2];
      }
      else {
        // The second parameter is the config
        data = undefined;
        config = args[1];
      }
    }
    else {
      // The first parameter is the JSON Schema
      url = '';
      data = args[0];
      config = args[1];
    }

    if (!url && !data) {
      error = ono('Invalid arguments. Expected a URL, file path, JSON/YAML string, or object.');
    }

    config = new Config(config, defaults);
  }
  catch (e) {
    error = e;
  }

  return {
    error: error,
    url: url,
    data: data,
    config: config,
    callback: callback
  };
}
