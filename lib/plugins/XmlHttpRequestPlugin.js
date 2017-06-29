'use strict';

/**
 * This plugin enables downlaoding files via the browser's XmlHttpRequest API.
 */
module.exports = {
  name: 'XmlHttpRequestPlugin',

  /**
   * This plugin's priority is the same as the HttpPlugin's priority, for consistency between the
   * Node.js and web browser functionality.
   */
  priority: 5,

  /**
   * Resolves a URL, relative to a base URL.
   *
   * @param {?string} args.from
   * The base URL to resolve against. If unset, then the current page URL is used.
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
    // TODO
  },
};
