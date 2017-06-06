(function () {
  'use strict';

  var testDirPath = getAbsolutePathOfTestDir();

  host.global.path = {
    /**
     * Returns the absolute path of the current working directory.
     * In Node, this is the "test" directory. In the browser, it is the directory of the current page.
     */
    cwd: function cwd () {
      if (host.node) {
        return process.cwd() + '/';
      }
      else {
        return location.href;
      }
    },

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
          throw new Error('TODO: Figure out how to return relative paths in Karma');
        }
        else {
          // Return the relative path from "/test/index.html"
          return file;
        }
      }
    },

    /**
     * Returns the absolute path of a file in the "tests" directory
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
     * Returns the path of a file in the "test" directory as a URL.
     */
    url: function url (file) {
      var absPath = path.abs(file);

      if (host.node) {
        // Return the absolute path as a URL (e.g. "file://path/to/json-schema-ref-parser/tests/files...")
        if (/^win/.test(process.platform)) {
          absPath = absPath.replace(/\\/g, '/');  // Convert Windows separators to URL separators
        }

        var fileURL = require('url').format({
          protocol: 'file:',
          slashes: true,
          pathname: absPath
        });

        return fileURL;
      }
      else {
        // Return the absolute URL (e.g. "http://localhost/test/files/...")
        return path.abs(file);
      }
    },
  };

  /**
   * Returns the absolute path of the "tests" directory
   */
  function getAbsolutePathOfTestDir () {
    if (host.node) {
      var absPath = require('path').resolve(__dirname, '..');

      if (/^[A-Z]\:[\\\/]/.test(absPath)) {
        // Lowercase the drive letter on Windows, for string comparison purposes
        absPath = absPath[0].toLowerCase() + absPath.substr(1);
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
