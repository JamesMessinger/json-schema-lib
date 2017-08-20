'use strict';

var ono = require('ono');
var File = require('./File');
var assign = require('../util/assign');
var __internal = require('../util/internal');

module.exports = FileArray;

/**
 * An array of {@link File} objects, with some helper methods.
 *
 * @param {Schema} schema - The JSON Schema that these files are part of
 *
 * @class
 * @extends Array
 */
function FileArray (schema) {
  var fileArray = [];

  /**
   * Internal stuff. Use at your own risk!
   *
   * @private
   */
  fileArray[__internal] = {
    /**
     * A reference to the {@link Schema} object
     */
    schema: schema,
  };

  // Return an array that "inherits" from FileArray
  return assign(fileArray, FileArray.prototype);
}

/**
 * Determines whether a given file is in the array.
 *
 * @param {string|File} url
 * An absolute URL, or a relative URL (relative to the schema's root file), or a {@link File} object
 *
 * @returns {boolean}
 */
FileArray.prototype.exists = function exists (url) {
  var file = findFile(this[__internal].schema, url);
  return !!file;
};

/**
 * Returns the given file in the array. Throws an error if not found.
 *
 * @param {string|File} url
 * An absolute URL, or a relative URL (relative to the schema's root file), or a {@link File} object
 *
 * @returns {File}
 */
FileArray.prototype.get = function get (url) {
  var file = findFile(this[__internal].schema, url);

  if (file) {
    return file;
  }

  if (this.length === 0) {
    throw ono('Unable to get %s. \nThe schema is empty.', url);
  }
  else {
    throw ono('Unable to get %s. \nThe schema does not include this file.', url);
  }
};

/**
 * Finds the given file in the schema
 *
 * @param {Schema} schema
 * @param {string|File} url
 * An absolute URL, or a relative URL (relative to the schema's root file), or a {@link File} object
 *
 * @returns {?File}
 */
function findFile (schema, url) {
  if (schema.files.length === 0) {
    return null;
  }

  if (url instanceof File) {
    // Short-circuit behavior for File obejcts
    return findByURL(schema.files, url.url);
  }

  // Try to find an exact URL match
  var file = findByURL(schema.files, url);

  if (!file) {
    // Resolve the URL and see if we can find a match
    var absoluteURL = schema.plugins.resolveURL({ from: schema.rootURL, to: url });
    file = findByURL(schema.files, absoluteURL);
  }

  return file;
}

/**
 * Finds a file by its exact URL
 *
 * @param {FileArray} files
 * @param {string} url
 * @returns {?File}
 */
function findByURL (files, url) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.url === url) {
      return file;
    }
  }
}
