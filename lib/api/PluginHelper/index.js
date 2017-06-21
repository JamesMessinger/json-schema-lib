'use strict';

var Symbol = require('../../util/Symbol');
var validatePlugins = require('./validatePlugins');

var __plugins = Symbol('__plugins');

module.exports = Pluginhelper;

/**
 * Helper methods for working with plugins.
 *
 * @param {object[]} [plugins] - The plugins to use
 */
function Pluginhelper (plugins) {
  validatePlugins(plugins);
  plugins = plugins || [];

  /**
   * @private
   */
  this[__plugins] = sortPlugins(plugins);
}
