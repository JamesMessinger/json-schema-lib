'use strict';

/**
 * The default configuration.
 */
module.exports = {
  /**
   * The Promise class to use when asynchronous methods are called without a callback.
   * Users can override this with a custom Promise implementation, such as Bluebird
   * or a polyfill.
   *
   * @type {function}
   */
  Promise: require('./Promise'),
};
