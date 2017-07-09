'use strict';

var ono = require('ono');
var typeOf = require('../util/typeOf');
var __internal = require('../util/internal');
var deepClone = require('../util/deepClone');
var validatePlugin = require('./PluginHelper/validatePlugin');
var validatePlugins = require('./PluginHelper/validatePlugins');

module.exports = PluginManager;

/**
 * Manages the plugins that are used by a {@link JsonSchemaLib} instance.
 *
 * @param {object[]} [plugins] - The initial plugins to load
 */
function PluginManager (plugins) {
  validatePlugins(plugins);
  plugins = plugins || PluginManager.defaults;

  /**
   * Internal stuff. Use at your own risk!
   *
   * @private
   */
  this[__internal] = {
    /**
     * The array of plugins
     */
    plugins: plugins.map(deepClone),
  };
}

/**
 * The default plugins that are used if no plugins are specified.
 *
 * NOTE: The default plugins differ for Node.js and web browsers.
 *
 * @type {object[]}
 */
PluginManager.defaults = [];

/**
 * Adds a plugin to this {@link PluginManager} instance.
 *
 * @param {object} plugin - A plugin object
 * @param {number} [priority] - Optionaly override the plugin's default priority.
 * @private
 */
PluginManager.prototype.use = function use (plugin, priority) {
  validatePlugin(plugin);
  validatePriority(priority);

  // Clone the plugin, so that multiple JsonSchemaLib instances can safely use the same plugin
  plugin = deepClone(plugin);
  plugin.priority = priority || plugin.priority;

  this[__internal].plugins.push(plugin);
};

/**
 * Serializes the {@link PluginManager}
 *
 * @returns {object}
 */
PluginManager.prototype.toJSON = function toJSON () {
  return this[__internal].plugins;
};

/**
 * Ensures that a user-supplied value is a valid plugin priority.
 * An error is thrown if the value is invalid.
 *
 * @param {*} priority - The user-supplied value to validate
 */
function validatePriority (priority) {
  var type = typeOf(priority);

  if (type.hasValue && !type.isNumber) {
    throw ono('Invalid arguments. Expected a priority number.');
  }
}
