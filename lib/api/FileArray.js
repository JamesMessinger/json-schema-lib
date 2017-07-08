'use strict';

var ono = require('ono');
var File = require('./File');

module.exports = FileArray;

/**
 * An array of {@link File} objects, with some helper methods.
 *
 * @param {Schema} schema - The JSON Schema that these files are part of
 * @returns {array}
 */
function FileArray (schema) {
  var files = [];

  /**
   * Determines whether a given file is in the array.
   *
   * @param {string|File} url
   * An absolute URL, or a relative URL (relative to the schema's root file), or a {@link File} object
   *
   * @returns {boolean}
   */
  files.exists = function exists (url) {
    if (this.length === 0) {
      return false;
    }

    // Get the absolute URL
    var absoluteURL = resolveURL(url, schema);

    // Try to find a file with this URL
    for (var i = 0; i < this.length; i++) {
      var file = this[i];
      if (file.url === absoluteURL) {
        return true;
      }
    }

    // If we get here, thne no files matched the URL
    return false;
  };

  /**
   * Returns the given file in the array. Throws an error if not found.
   *
   * @param {string|File} url
   * An absolute URL, or a relative URL (relative to the schema's root file), or a {@link File} object
   *
   * @returns {File}
   */
  files.get = function get (url) {
    if (this.length === 0) {
      throw ono('Unable to get %s. \nThe schema is empty.', url);
    }

    // Get the absolute URL
    var absoluteURL = resolveURL(url, schema);

    // Try to find a file with this URL
    for (var i = 0; i < this.length; i++) {
      var file = this[i];
      if (file.url === absoluteURL) {
        return file;
      }
    }

    // If we get here, then no files matched the URL
    throw ono('Unable to get %s. \nThe schema does not include this file.', absoluteURL);
  };

  return files;
}

/**
 * Resolves the given URL to an absolute URL.
 *
 * @param {string|File} url
 * An absolute URL, or a relative URL (relative to the schema's root file), or a {@link File} object
 *
 * @param {Schema} schema
 * @returns {boolean}
 */
function resolveURL (url, schema) {
  if (url instanceof File) {
    // The URL is already absolute
    return url.url;
  }

  return schema.plugins.resolveURL({ from: schema.rootURL, to: url });
}
