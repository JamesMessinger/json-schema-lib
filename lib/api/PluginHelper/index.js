/* eslint no-unused-vars:off */
'use strict';

var Symbol = require('../../util/Symbol');
var validatePlugins = require('./validatePlugins');
var omit = require('../../util/omit');

var __internal = Symbol('__internal');

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

['resolveURL'].forEach(function (methodName) {
  PluginHelper.prototype[methodName] = function (args) {
    var plugins = this[__internal].plugins.filter(filterByMethod(methodName));
    var plugin, pluginIndex = -1, finalResult;

    args.schema = this[__internal].schema;
    args.next = next;

    invokeNextPlugin();
    return finalResult;

    function invokeNextPlugin () {
      pluginIndex++;

      if (pluginIndex < plugins.length) {
        plugin = plugins[pluginIndex][methodName];

        try {
          var returnValue = plugin[methodName].call(null, args);
          next(null, returnValue);
        }
        catch (err) {
          next(err);
        }
      }
      else {

      }
    }

    function next (err, value) {

    }
  };
});

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

/**
 * Used to filter plugins that implement the specified method.
 *
 * @param {string} methodName
 * @returns {function}
 */
function filterByMethod (methodName) {
  return function methodFilter (plugin) {
    return typeof plugin[methodName] === 'function';
  };
}
