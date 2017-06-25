/* eslint no-unused-vars:off */
'use strict';

var ono = require('ono');
var __internal = require('../../util/internal');
var validatePlugins = require('./validatePlugins');
var omit = require('../../util/omit');
var callSyncPlugin = require('./callSyncPlugin');

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
  var url = callSyncPlugin(this, 'resolveURL', args);

  if (url === undefined || url === null) {
    throw ono('Error in resolveURL: No value was returned');
  }
  else if (typeof url !== 'string') {
    throw ono('Error in resolveURL: The return value was not a string (%s)', typeof url);
  }
  else {
    return url;
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
