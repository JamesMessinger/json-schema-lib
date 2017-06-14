'use strict';

module.exports = File;

/**
 * Contains information about a file, such as its path, type, and contents.
 *
 * @param {File} file - An object with some or all of the {@link File} properties
 * @class
 */
function File (file) {
  /**
   * The file's full (absolute) URL, without any fragment (#)
   *
   * NOTE: The {@link File#url} property is always url-encoded, even for local filesystem paths.
   * To get the url-decoded path for user-friendly display purposes or for accessing the local filesystem,
   * use the {@link File#path} instead.
   *
   * @type {string}
   */
  this.url = file.url;

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
  this.path = file.path;

  /**
   * The file's extension (including the ".").
   * If the file has no extension, then this will be an empty string.
   *
   * @type {string}
   */
  this.extension = file.extension || '';

  /**
   * The file's data. This can be any data type, including a string, object, array, binary, etc.
   *
   * @type {*}
   */
  this.data = undefined;

  /**
   * The file's MIME type (e.g. "application/json", "text/html", etc.), if known.
   *
   * @type {?string}
   */
  this.mimeType = undefined;
}

/**
 * Returns a human-friendly representation of the File object.
 *
 * @returns {string}
 */
File.prototype.toString = function toString () {
  return this.path;
};
