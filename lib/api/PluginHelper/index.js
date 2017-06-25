/* eslint no-unused-vars:off */
'use strict';

var ono = require('ono');
var __internal = require('../../util/internal');
var validatePlugins = require('./validatePlugins');
var omit = require('../../util/omit');

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

['resolveURL'].forEach(function createSyncMethod (methodName) {
  /**
   * All {@link PluginHelper} methods receive a single object argument with a few standard
   * properties and possibly some additional properties that are specific to the method being called.
   * Plugins are invoked in order, based on their priority.  Each plugin may return a value or call
   * the next plugin in the chain.
   *
   * @param {Schema} args.schema
   * The JSON Schema that is being read
   *
   * @param {function} args.next
   * If this function is called without any arguments, then the next plugin in the chain will be called.
   * If this function is called with an error or a result value, then the next plugin will NOT be called,
   * and the result/error will be returned/thrown.
   *
   * @returns {*}
   */
  PluginHelper.prototype[methodName] = function (args) {
    var plugins = this[__internal].plugins.filter(filterByMethod(methodName));
    args.schema = this[__internal].schema;

    return invokePluginSync(plugins, 0, methodName, args);
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

function invokePluginSync (plugins, index, methodName, args) {
  var plugin = plugins[index];
  var result, error, nextCalled;

  if (!plugin) {
    // We've reached the end of the plugin chain
    return;
  }

  // Invoke the plugin method. It can return a value, throw an error, or call next()
  args.next = next;
  result = plugin[methodName].call(null, args);

  if (result !== undefined && nextCalled) {
    throw ono('Error in %s.%s: Cannot return a value and call next()', plugin.name, methodName);
  }

  if (error) {
    throw ono(error, 'Error in %s.%s:', plugin.name, methodName);
  }
  else if (nextCalled) {
    return invokePluginSync(plugins, index + 1, methodName, args);
  }
  else {
    return result;
  }

  function next (err, value) {
    if (nextCalled) {
      error = ono('Error in %s.%s: next() was called multiple times.', plugin.name, methodName);
    }

    nextCalled = true;
    error = err;
    result = value;
  }
}
