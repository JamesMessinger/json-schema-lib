'use strict';

var jsonSchemaLib = require('./api');
var promiseConfig = require('./plugins/promiseConfig');
var readAsyncMethod = require('./plugins/readAsyncMethod');
var readSyncMethod = require('./plugins/readSyncMethod');

module.exports = jsonSchemaLib;

// Load the default plugins for Node.js
jsonSchemaLib.use(promiseConfig);
jsonSchemaLib.use(readAsyncMethod);
jsonSchemaLib.use(readSyncMethod);
