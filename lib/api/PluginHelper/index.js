'use strict';

var Symbol = require('../../util/Symbol');
var validatePlugins = require('./validatePlugins');

var __plugins = Symbol('__plugins');

module.exports = PluginHelper;

/**
 * Helper methods for working with plugins.
 *
 * @param {object[]} [plugins] - The plugins to use
 */
function PluginHelper (plugins) {
  validatePlugins(plugins);
  plugins = plugins || [];

  /**
   * The array of plugin objects, sorted by priority.
   *
   * @private
   */
  this[__plugins] = plugins.slice().sort(sortByPriority);
}

/**
 * Resolves a URL, relative to a base URL.
 *
 * @param {?string} from
 * The base URL to resolve against. If null, then the URL is resolved against the current directory.
 *
 * @param {string} to
 * The URL to resolve. If absolute, then it will be returned as-is. If relative, then it is resolved
 * against the `from` parameter.
 *
 * @returns {string}
 */
PluginHelper.prototype.resolveURL = function resolveURL (from, to) {
  // TODO
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
