'use strict';

/**
 * This plugin enables downlaoding files via the browser's XMLHttpRequest API.
 */
module.exports = {
  name: 'XMLHttpRequestPlugin',

  /**
   * This plugin's priority is the same as the HttpPlugin's priority, for consistency between the
   * Node.js and web browser functionality.
   */
  priority: 5,

  /**
   * Synchronously downlaods a file.
   *
   * @param {File} args.file - The {@link File} to read
   * @param {function} args.next - Calls the next plugin, if the file is not a local filesystem file
   */
  readFileSync: function readFileSync (args) {
    var file = args.file;
    var config = args.config;
    var next = args.next;


  },

  /**
   * Asynchronously downlaods a file.
   *
   * @param {File} args.file - The {@link File} to read
   * @param {function} args.next - Calls the next plugin, if the file is not a local filesystem file
   */
  readFileAsync: function readFileAsync (args) {
    var file = args.file;
    var config = args.config;
    var next = args.next;
  },

};


function xhrRequest () {
  var request = new XMLHttpRequest
}
