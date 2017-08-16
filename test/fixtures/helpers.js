(function () {
  'use strict';

  var nodeUrlPlugin = findPluginByName('NodeUrlPlugin');
  var browserUrlPlugin = findPluginByName('BrowserUrlPlugin');
  var jsonPlugin = findPluginByName('JsonPlugin');
  var fileSystemPlugin = findPluginByName('FileSystemPlugin');
  var bufferDecoderPlugin = findPluginByName('BufferDecoderPlugin');
  var textDecoderPlugin = findPluginByName('TextDecoderPlugin');
  var httpPlugin = findPluginByName('HttpPlugin');
  var xhrPlugin = findPluginByName('XMLHttpRequestPlugin');
  var arrayDecoderPlugin = findPluginByName('ArrayDecoderPlugin');

  host.global.helpers = {
    /**
     * Returns a POJO with the default JsonSchemaLib configuration
     *
     * @returns {object}
     */
    getDefaultConfig: function getDefaultConfig () {
      return {
        Promise: jsonSchemaLib.config.Promise,
        http: {
          headers: {},
          maxRedirects: 5,
          timeout: 5000,
          withCredentials: false,
        }
      };
    },

    /**
     * Returns an array of POJOs that matches the default JsonSchemaLib plugins
     *
     * @param {boolean} sorted
     * @returns {object[]}
     */
    getDefaultPlugins: function getDefaultPlugins (sorted) {
      if (host.node) {
        if (sorted) {
          return [
            nodeUrlPlugin, jsonPlugin, fileSystemPlugin, bufferDecoderPlugin, httpPlugin, arrayDecoderPlugin
          ];
        }
        else {
          return [
            nodeUrlPlugin, fileSystemPlugin, httpPlugin, bufferDecoderPlugin, arrayDecoderPlugin, jsonPlugin
          ];
        }
      }
      else {
        if (sorted) {
          return [
            browserUrlPlugin, jsonPlugin, textDecoderPlugin, xhrPlugin, arrayDecoderPlugin
          ];
        }
        else {
          return [
            browserUrlPlugin, xhrPlugin, textDecoderPlugin, arrayDecoderPlugin, jsonPlugin
          ];
        }
      }
    },
  };

  function findPluginByName (name) {
    for (var i = 0; i < jsonSchemaLib.plugins.length; i++) {
      var plugin = jsonSchemaLib.plugins[i];
      if (plugin.name === name) {
        return plugin;
      }
    }
  }

}());
