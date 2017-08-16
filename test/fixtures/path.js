(function () {
  'use strict';

  var testDirPath = getAbsolutePathOfTestDir();

  var path = host.global.path = {
    /**
     * Returns the relative path of a file in the "tests" directory
     */
    rel: function rel (file) {
      if (host.node) {
        // Return the relative path from the project root
        return require('path').join('test', file);
      }
      else {
        // Encode special characters in paths when running in a browser
        file = urlEncodePath(file);

        if (host.karma) {
          return 'base/test/' + file;
        }
        else {
          // Return the relative path from "/test/index.html"
          return file;
        }
      }
    },

    /**
     * Returns the absolute path of a file in the "test" directory
     */
    abs: function abs (file) {
      if (host.node) {
        return require('path').join(testDirPath, file || '/');
      }
      else {
        return testDirPath + urlEncodePath(file);
      }
    },

    /**
     * Returns the path of a file in the "test" directory as a file:// URL.
     */
    fileURL: function fileURL (file) {
      var absPath = path.abs(file);

      if (/^win/.test(process.platform)) {
        absPath = absPath.replace(/\\/g, '/');  // Convert Windows separators to URL separators
      }

      // Convert the absolute filesystem path to a a URL
      // (e.g. "file://path/to/json-schema-ref-parser/tests/files...")
      var url = require('url').format({
        protocol: 'file:',
        slashes: true,
        pathname: absPath
      });

      return url;
    },

    /**
     * Returns the path of a file in the "test" directory as an http:// URL.
     */
    httpURL: function httpURL (file) {
      var relPath = path.rel(file);

      if (/^win/.test(process.platform)) {
        relPath = relPath.replace(/\\/g, '/');  // Convert Windows separators to URL separators
      }

      return 'http://localhost/' + relPath;
    },
  };

  // Each function has a `.abs()` function, which returns the absolute path in the same format
  path.abs.abs = path.abs;
  path.rel.abs = path.abs;
  path.fileURL.abs = path.fileURL;
  path.httpURL.abs = path.httpURL;

  /**
   * Returns the absolute path of the "tests" directory
   */
  function getAbsolutePathOfTestDir () {
    if (host.node) {
      var absPath = require('path').resolve(__dirname, '..');

      if (/^[A-Z]\:[\\\/]/.test(absPath)) {
        // Uppercase the drive letter on Windows, for string comparison purposes
        absPath = absPath[0].toUpperCase() + absPath.substr(1);
      }

      return absPath;
    }
    else {
      var filename = document.querySelector('script[src*="fixtures/path.js"]').src;
      return filename.substr(0, filename.indexOf('fixtures/path.js'));
    }
  }

  /**
   * URI-encodes the given file path
   *
   * @param {string} file
   * @returns {string}
   */
  function urlEncodePath (file) {
    return encodeURIComponent(file).split('%2F').join('/');
  }

}());
