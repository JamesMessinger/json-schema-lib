'use strict';

module.exports = FileArray;

/**
 * An array of {@link File} objects, with some helper methods.
 *
 * @returns {array}
 */
function FileArray () {
  var files = [];

  /**
   * Determines whether a given file is in the array.
   *
   * @param {string} url - An absolute or relative file path or URL
   * @returns {boolean}
   */
  files.exists = function exists (url) {                                                        // eslint-disable-line no-unused-vars
    // TODO: Implement File.exists()
  };

  /**
   * Returns the given file in the array. Throws an error if not found.
   *
   * @param {string} url - An absolute or relative file path or URL
   * @returns {File}
   */
  files.get = function get (url) {                                                              // eslint-disable-line no-unused-vars
    // TODO: Implement File.get()
  };

  return files;
}
