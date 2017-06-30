'use strict';

var PluginManager = require('./api/PluginManager');

// Default plugins for web browsers
PluginManager.defaults.push(
  require('./plugins/XmlHttpRequestPlugin'),
  require('./plugins/TextDecoderPlugin'),
  require('./plugins/ArrayDecoderPlugin'),
  require('./plugins/JsonPlugin')
);

module.exports = require('./exports');
