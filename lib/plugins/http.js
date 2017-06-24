'use strict';

var url = require('url');

var protocolPattern = /^(http|https):\/\//i;

/**
 * This plugin enables downlaoding files from HTTP or HTTPS URLs.
 */
module.exports = {
  name: 'HttpPlugin',

  /**
   * This plugin has a lower priority than the FileSystemPlugin, meaning that JsonSchemaLib will
   * first attempt to interpret URLs as local filesystem paths. If a URL is not a valid filesystem
   * path, then it be handled by this plugin.
   */
  priority: 5,

  /**
   * Resolves a URL, relative to a base URL.
   *
   * @param {?string} args.from
   * The base URL to resolve against. If unset, then {@link args.to} MUST be absolute.
   *
   * @param {string} args.to
   * The URL to resolve. This may be absolute or relative. If relative, then it will be resolved
   * against {@link args.from}
   *
   * @param {function} args.next
   * Calls the next plugin, if the URL is not an HTTP or HTTPS URL.
   */
  resolveURL: function resolveURL (args) {
    var from = args.from;
    var to = args.to;
    var next = args.next;

    if (!isSupportedURL(from) && !isSupportedURL(to)) {
      // It's not an HTTP or HTTPS URL, so let some other plugin handle it
      return next();
    }

    return resolve(from || '', to);
  },
};

/**
 * Determines whether the given URL is an HTTP or HTTPS URL.
 *
 * @param {string} u
 * @returns {boolean}
 */
function isSupportedURL (u) {
  var protocol = protocolPattern.exec(u);
  return protocol;
}

/**
 * Resolve the given URL, using either the legacy Node.js url API, or the WHATWG URL API.
 *
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
function resolve (from, to) {
  if (typeof url.URL === 'function') {
    // Use the new WHATWG URL API
    var u = new url.URL(to, from);
    return u.href;
  }
  else {
    // Use the legacy url API
    return url.resolve(from, to);
  }
}
