'use strict';

var path = require('path');

var protocolPattern = /^([a-z\d\+\-\.]+:)?\/\//i;

/**
 * This plugin enables reading files from the local filesystem.
 */
module.exports = {
  name: 'FileSystemPlugin',

  /**
   * This plugin has a higher priority than the HttpPlugin, meaning that JsonSchemaLib will first
   * attempt to interpret URLs as local filesystem paths.  If a URL is not a valid filesystem
   * path, then it be handled by the HttpPlugin instead.
   */
  priority: 10,

  /**
   * Resolves a local filesystem path, relative to a base path.
   *
   * @param {?string} args.from
   * The base path to resolve against. If unset, then the current working directory is used.
   *
   * @param {string} args.to
   * The path to resolve. This may be absolute or relative. If relative, then it will be resolved
   * against {@link args.from}
   *
   * @param {function} args.next
   * Calls the next plugin, if the path is not a filesystem path.
   */
  resolveURL: function resolveURL (args) {
    var from = args.from;
    var to = args.to;
    var next = args.next;

    if (isUnsupportedPath(from) || isUnsupportedPath(to)) {
      // It's not a filesystem path, so let some other plugin handle it
      return next();
    }

    return path.resolve(from || '', to);
  },
};

/**
 * Determines whether the given URL is a local filesystem path that is supported by this plugin.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isUnsupportedPath (url) {
  // If the URL has any protocol other than "file://", then it's unsupported
  var protocol = protocolPattern.exec(url);
  return protocol && protocol[1].toLowerCase() !== 'file:';
}
