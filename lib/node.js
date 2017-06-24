'use strict';

var PluginManager = require('./api/PluginManager');

// Default plugins for Node.js
PluginManager.defaults.push(
  require('./plugins/fs'),
  require('./plugins/http')
);

module.exports = require('./exports');
