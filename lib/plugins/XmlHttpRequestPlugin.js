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
};
