/* eslint no-unused-vars:off */
'use strict';

var ono = require('ono');
var Config = require('./Config');
var symbols = require('../util/symbols');

module.exports = JsonSchemaLib;

/**
 * The public JsonSchemaLib API.
 *
 * @param {Config} [config]
 * @class
 */
function JsonSchemaLib (config) {
  this.config = new Config(config);
}

/**
 * Adds a plugin to this {@link JsonSchemaLib} instance.
 *
 * @param {function|object} plugin
 * A plugin object or plugin initializer function. An initializer function has access to
 * JsonSchemaLib API classes, and may or may not return a plugin object.
 *
 * @param {number} [priority]
 * Optionaly override the plugin's default priority.
 */
JsonSchemaLib.prototype.use = function use (plugin, priority) {
  var plugins = this.config[symbols.__plugins];

  if (typeof plugin === 'function') {
    this.config.plugins.use()
    plugin = plugin(this);

    if (plugin) {
      registerPlugin(plugins, plugin, priority);
    }
  }
  else {
    registerPlugin(plugins, plugin, priority);
  }
};

function registerPlugin (plugins, plugin, priority) {
  if (!plugin && typeof plugin !== 'object') {
    throw ono('Invalid arguments. Expected a plugin object or function.');
  }


}
