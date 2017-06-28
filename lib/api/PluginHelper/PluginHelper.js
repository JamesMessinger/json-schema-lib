/* eslint no-unused-vars:off */
'use strict';

var ono = require('ono');
var __internal = require('../../util/internal');
var validatePlugins = require('./validatePlugins');
var omit = require('../../util/omit');
var callSyncPlugin = require('./callSyncPlugin');
var callAsyncPlugin = require('./callAsyncPlugin');

module.exports = PluginHelper;

/**
 * Helper methods for working with plugins.
 *
 * @param {object[]|null} plugins - The plugins to use
 * @param {Schema} schema - The {@link Schema} to apply the plugins to
 */
function PluginHelper (plugins, schema) {
  validatePlugins(plugins);
  plugins = plugins || [];

  /**
   * Internal stuff. Use at your own risk!
   *
   * @private
   */
  this[__internal] = {
    /**
     * A reference to the {@link Schema} object
     */
    schema: schema,

    /**
     * The array of plugins, sorted by priority
     */
    plugins: plugins.slice().sort(sortByPriority),
  };
}

/**
 * Resolves a URL, relative to a base URL.
 *
 * @param {?string} args.from - The base URL to resolve against, if any
 * @param {string} args.to - The URL to resolve. This may be absolute or relative.
 * @returns {string} - Returns an absolute URL
 */
PluginHelper.prototype.resolveURL = function resolveURL (args) {
  try {
    var handled = callSyncPlugin(this, 'resolveURL', args);
    var url = handled.result;
    var plugin = handled.plugin || { name: '' };

    if (url === undefined || url === null) {
      throw ono('Error in %s.resolveURL: No value was returned', plugin.name);
    }
    else if (typeof url !== 'string') {
      throw ono('Error in %s.resolveURL: The return value was not a string (%s)', plugin.name, typeof url);
    }
    else {
      return url;
    }
  }
  catch (err) {
    throw ono(err, 'Unable to resolve %s', args.to);
  }
};

/**
 * Synchronously reads the given file from its source (e.g. web server, filesystem, etc.)
 *
 * @param {File} args.file - The {@link File} to read
 * @returns {*} - The file's data, which can be any value (string, number, object, array, null, undefined, etc.)
 */
PluginHelper.prototype.readFileSync = function readFileSync (args) {
  try {
    var handled = callSyncPlugin(this, 'readFileSync', args);

    if (!handled.plugin) {
      throw ono('Error in readFileSync: No plugin was able to read the file');
    }
    else {
      return handled.result;
    }
  }
  catch (err) {
    throw ono(err, 'Unable to read %s', args.file.url);
  }
};

/**
 * Asynchronously reads the given file from its source (e.g. web server, filesystem, etc.)
 *
 * @param {File} args.file
 * The {@link File} to read. Its {@link File#data} property will be set to the file's contents.
 * In addition, {@link File#mimeType} and {@link File#encoding} may be set, if determinable.
 *
 * @param {function} callback
 * The callback function to call after the file has been read
 */
PluginHelper.prototype.readFileAsync = function readFileAsync (args, callback) {
  callAsyncPlugin(this, 'readFileAsync', args, function (err, handled) {
    if (!err && !handled.plugin) {
      err = ono('Error in readFileAsync: No plugin was able to read the file');
    }

    if (err) {
      err = ono(err, 'Unable to read %s', args.file.url);
      callback(err);
    }
    else {
      callback(null, handled.result);
    }
  });
};

/**
 * Parses the given file's data, in place.
 *
 * @param {File} args.file - The {@link File} to parse. Its {@link File#data} property will be set.
 */
PluginHelper.prototype.parseFile = function parseFile (args) {
  try {
    // NOTE: It's ok if no plugin handles this method. The file data will just remain in its "raw" format.
    callSyncPlugin(this, 'parseFile', args);
  }
  catch (err) {
    throw ono(err, 'Unable to parse %s', args.file.url);
  }
};

/**
 * Allows the {@link PluginHelper} to be safely serialized as JSON by removing circular references.
 *
 * @returns {object}
 */
PluginHelper.prototype.toJSON = function toJSON () {
  return omit(this, __internal);
};

/**
 * Used to sort plugins by priority, so that plugins with higher piority come first
 * in the __plugins array.
 *
 * @param {object} pluginA
 * @param {object} pluginB
 * @returns {number}
 */
function sortByPriority (pluginA, pluginB) {
  return pluginB.priority - pluginA.priority;
}
