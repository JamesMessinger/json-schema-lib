'use strict';

/**
 * This plugin decodes Node.js {@link Buffer} objects to strings, if possible.
 */
module.exports = {
  name: 'BufferDecoderPlugin',

  /**
   * This plugin has the same priority as the TextDecoderPlugin, which is used in web browsers.
   * The TextDecoder API doesn't exist in Node.js, so {@link Buffer#toString} is used instead.
   */
  priority: 10,

  /**
   * Decodes the given file's data, in place.
   *
   * @param {File} args.file - The {@link File} to decode.
   * @param {function} args.next - Calls the next plugin, if the file data cannot be decoded
   * @returns {string|undefined}
   */
  decodeFile: function decodeFile (args) {
    var file = args.file;
    var next = args.next;

    if (file.encoding && Buffer.isBuffer(file.data)) {
      try {
        // Attempt to decode the Buffer
        return file.data.toString(file.encoding);
      }
      catch (err) {
        if (/unknown encoding/i.test(err.message)) {
          // Unknown encoding, so just call the next decoder plugin
          next();
        }
        else {
          throw err;
        }
      }
    }
    else {
      // The file data is not a Buffer, so call the next decoder plugin
      next();
    }
  },
};
