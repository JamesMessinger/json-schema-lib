'use strict';

var URL = require('url').URL;
var legacyURL = require('url');

var protocolPattern = /^(http|https):\/\//i;

/**
 * This plugin resolves URLs using the WHATWG URL API or Node's legacy url API.
 */
module.exports = {
  name: 'NodeUrlPlugin',

  /**
   * This plugin has a low priority, to allow for higher-priority third-party resolver plugins.
   *
   * NOTE: Priorities 0 - 99 are reserved for JsonSchemaLib.
   *       Third-party plugins should have priorities of 100 or greater.
   */
  priority: 20,

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
   *
   * @returns {string|undefined}
   */
  resolveURL: function resolveURL (args) {
    var from = args.from;
    var to = args.to;
    var next = args.next;

    if (!isSupportedURL(from) && !isSupportedURL(to)) {
      // It's not an HTTP or HTTPS URL, so let some other plugin handle it
      return next();
    }

    return resolveUrl(from || '', to);
  },
};

/**
 * Determines whether the given URL is an HTTP or HTTPS URL.
 *
 * @param {string} u
 * @returns {boolean}
 */
function isSupportedURL (u) {
  return protocolPattern.exec(u) !== null;
}

/**
 * Resolve the given URL, using either the legacy Node.js url API, or the WHATWG URL API.
 *
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
function resolveUrl (from, to) {
  if (typeof URL === 'function') {
    // Use the new WHATWG URL API
    var url = new URL(to, from);
    return url.href;
  }
  else {
    // Use the legacy url API
    return legacyURL.resolve(from, to);
  }
}
