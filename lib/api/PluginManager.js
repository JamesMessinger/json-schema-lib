'use strict';

var _lib = require('../util/symbols')._lib;

module.exports = PluginManager;

function PluginManager (jsonSchemaLib) {
  this[_lib] = jsonSchemaLib;
}

var plugin = {
  name: 'JsonParser',
  priority: 1000,

};
