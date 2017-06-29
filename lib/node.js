'use strict';

var PluginManager = require('./api/PluginManager');

// Default plugins for Node.js
PluginManager.defaults.push(
  require('./plugins/FileSystemPlugin'),
  require('./plugins/HttpPlugin'),
  require('./plugins/BufferDecoderPlugin'),
  require('./plugins/ArrayDecoderPlugin')
);

module.exports = require('./exports');
