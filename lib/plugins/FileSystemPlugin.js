'use strict';

var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var lowercase = require('../util/lowercase');

// Windows supports "/" and "\" path separators. All other platforms only support "/"
var pathSeparators = /^win/.test(process.platform) ? ['/', '\\'] : ['/'];

// Matches the protocol (if any) from a URL or file path.
// This is used to distinguish "file://" from "http://"
var protocolPattern = /^([a-z\d\+\-\.]+:)?\/\//i;

/**
 * This plugin enables reading files from the local filesystem.
 */
module.exports = {
  name: 'FileSystemPlugin',

  /**
   * This plugin has a higher priority than the HttpPlugin, meaning that JsonSchemaLib will first
   * attempt to interpret URLs as local filesystem paths.  If a URL is not a valid filesystem
   * path, then it be handled by the HttpPlugin instead.
   */
  priority: 10,

  /**
   * Resolves a local filesystem path, relative to a base path.
   *
   * @param {?string} args.from
   * The base path to resolve against. If unset, then the current working directory is used.
   *
   * @param {string} args.to
   * The path to resolve. This may be absolute or relative. If relative, then it will be resolved
   * against {@link args.from}
   *
   * @param {function} args.next
   * Calls the next plugin, if the path is not a filesystem path.
   *
   * @returns {string|undefined}
   */
  resolveURL: function resolveURL (args) {
    var from = args.from;
    var to = args.to;
    var next = args.next;

    if (isUnsupportedPath(from) || isUnsupportedPath(to)) {
      // It's not a filesystem path, so let some other plugin handle it
      return next();
    }

    // The `from` path needs to be a directory, not a file. So, if the last character is NOT a
    // path separator, then we need to remove the filename from the path
    if (from && pathSeparators.indexOf(from[from.length - 1]) === -1) {
      from = path.dirname(from);
    }

    return path.resolve(from || '', to);
  },

  /**
   * Synchronously reads a file from the local filesystem.
   *
   * @param {File} args.file - The {@link File} to read
   * @param {function} args.next - Calls the next plugin, if the file is not a local filesystem file
   * @returns {Buffer|undefined}
   */
  readFileSync: function readFileSync (args) {
    var file = args.file;
    var next = args.next;

    if (isUnsupportedPath(file.url)) {
      // It's not a filesystem path, so let some other plugin handle it
      return next();
    }

    inferFileMetadata(file);
    return fs.readFileSync(file.url);
  },

  /**
   * Asynchronously reads a file from the local filesystem.
   *
   * @param {File} args.file - The {@link File} to read
   * @param {function} args.next - Calls the next plugin, if the file is not a local filesystem file
   */
  readFileAsync: function readFileSync (args) {
    var file = args.file;
    var next = args.next;

    if (isUnsupportedPath(file.url)) {
      // It's not a filesystem path, so let some other plugin handle it
      return next();
    }

    inferFileMetadata(file);
    fs.readFile(file.url, next);
  },
};

/**
 * Determines whether the given URL is a local filesystem path that is supported by this plugin.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isUnsupportedPath (url) {
  // If the URL has any protocol other than "file://", then it's unsupported
  var protocol = protocolPattern.exec(url);
  return protocol && protocol[1].toLowerCase() !== 'file:';
}

/**
 * Infers the file's MIME type and encoding, based on its file extension.
 *
 * @param {File} file
 */
function inferFileMetadata (file) {
  file.mimeType = lowercase(mime.lookup(file.url) || null);
  file.encoding = lowercase(mime.charset(file.mimeType) || null);
}
