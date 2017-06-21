'use strict';

module.exports = File;

/**
 * Contains information about a file, such as its path, type, and contents.
 *
 * @param {string} url - The absolute or relative URL of the file
 * @param {Schema} schema - The JSON Schema that the file is part of
 *
 * @class
 */
function File (url, schema) {
  /**
   * The {@link Schema} that this file belongs to.
   *
   * @type {Schema}
   */
  this.schema = schema;

  /**
   * The file's full (absolute) URL, without any fragment (#)
   *
   * NOTE: The {@link File#url} property is always url-encoded, even for local filesystem paths.
   * To get the url-decoded path for user-friendly display purposes or for accessing the local filesystem,
   * use the {@link File#path} instead.
   *
   * @type {string}
   */
  this.url = plugins.encodeURI(url);

  /**
   * This is the same as {@link File#url}, except that it is NOT url-encoded.
   *
   * This is most useful for local filesystem paths, since "file:///foo%20bar.json" will be
   * converted to "/foo bar.json".
   *
   * For HTTP URLs, this property is simply the url-decoded version of {@link File#url},
   * which may still be useful for display or logging purposes, since it will be more human-readable.
   *
   * @type {string}
   */
  this.path = plugins.decodeURI(url);

  /**
   * The file's MIME type (e.g. "application/json", "text/html", etc.), if known.
   *
   * @type {?string}
   */
  this.mimeType = undefined;

  /**
   * The file's data. This can be any data type, including a string, object, array, binary, etc.
   *
   * @type {*}
   */
  this.data = undefined;
}

/**
 * Returns a human-friendly representation of the File object.
 *
 * @returns {string}
 */
File.prototype.toString = function toString () {
  return this.path;
};

/**
 * Allows the File object to be safely serialized as JSON by removing circular references.
 *
 * @returns {object}
 */
File.prototype.toJSON = function toJSON () {
  var keys = Object.keys(this);
  var json = {};

  for (var i = 0; i < keys.length; i++) {
    var key = Object.keys[i];
    if (key !== 'schema') {
      json[key] = this[key];
    }
  }

  return json;
};
