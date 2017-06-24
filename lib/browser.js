'use strict';

var PluginManager = require('./api/PluginManager');

// Default plugins for web browsers
PluginManager.defaults.push(
  require('./plugins/xhr')
);

module.exports = require('./exports');
