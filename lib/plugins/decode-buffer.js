'use strict';

/**
 * This plugin decodes Node.js {@link Buffer} objects to strings, if possible.
 */
module.exports = {
  name: 'DecodeBufferPlugin',

  /**
   * This plugin has a higher priority than the DecodeArrayPlugin, so the DecodeArrayPlugin will be
   * used as a fallback for non-Buffer data, or Buffers that can't be decoded by {@link Buffer#toString}.
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
        // Unknown encoding, so just call the next decoder plugin
        next();
      }
    }
    else {
      // The file data is not a Buffer, so call the next decoder plugin
      next();
    }
  },
};
