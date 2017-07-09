(function () {
  'use strict';

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
            { name: 'NodeUrlPlugin', priority: 20 },
            { name: 'JsonPlugin', priority: 20 },
            { name: 'FileSystemPlugin', priority: 10 },
            { name: 'BufferDecoderPlugin', priority: 10 },
            { name: 'HttpPlugin', priority: 5 },
            { name: 'ArrayDecoderPlugin', priority: 5 },
          ];
        }
        else {
          return [
            { name: 'NodeUrlPlugin', priority: 20 },
            { name: 'FileSystemPlugin', priority: 10 },
            { name: 'HttpPlugin', priority: 5 },
            { name: 'BufferDecoderPlugin', priority: 10 },
            { name: 'ArrayDecoderPlugin', priority: 5 },
            { name: 'JsonPlugin', priority: 20 },
          ];
        }
      }
      else {
        if (sorted) {
          return [
            { name: 'BrowserUrlPlugin', priority: 20 },
            { name: 'JsonPlugin', priority: 20 },
            { name: 'TextDecoderPlugin', priority: 10 },
            { name: 'XMLHttpRequestPlugin', priority: 5 },
            { name: 'ArrayDecoderPlugin', priority: 5 },
          ];
        }
        else {
          return [
            { name: 'BrowserUrlPlugin', priority: 20 },
            { name: 'XMLHttpRequestPlugin', priority: 5 },
            { name: 'TextDecoderPlugin', priority: 10 },
            { name: 'ArrayDecoderPlugin', priority: 5 },
            { name: 'JsonPlugin', priority: 20 },
          ];
        }
      }
    },
  };

}());
