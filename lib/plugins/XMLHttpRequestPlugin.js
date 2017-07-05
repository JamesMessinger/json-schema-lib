'use strict';

var ono = require('ono');
var setHttpMetadata = require('../util/setHttpMetadata');

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
    var error, response;

    sendRequest(false, file.url, config, function handleResponse (err, res) {
      error = err;
      response = res;
    });

    if (error) {
      throw error;
    }
    else {
      setHttpMetadata(file, response);
      return response.data;
    }
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

    sendRequest(false, file.url, config, function handleResponse (err, res) {
      if (err) {
        next(err);
      }
      else {
        setHttpMetadata(file, res);
        next(null, res.data);
      }
    });
  },

};

/**
 * Sends an HTTP GET request using XMLHttpRequest.
 *
 * @param {boolean} async - Whether to send the request synchronously or asynchronously
 * @param {string} url - The absolute URL to request
 * @param {Config} config - Configuration settings, such as timeout, headers, etc.
 * @param {function} callback - Called with an error or response object
 */
function sendRequest (async, url, config, callback) {
  var req = new XMLHttpRequest();
  req.open('GET', url, async);

  req.onerror = handleError;
  req.ontimeout = handleError;
  req.onload = handleResponse;

  req.withCredentials = config.http.withCredentials;

  // Timeout can only be set for async requests
  if (async) {
    req.timeout = config.http.timeout;
  }

  // Set request headers
  Object.keys(config.http.headers).forEach(function (key) {
    var value = config.http.headers[key];
    if (value !== undefined) {
      req.setRequestHeader(key, value);
    }
  });

  req.send();

  function handleResponse () {
    var res = {
      status: getResponseStatus(req.status, url),
      headers: parseResponseHeaders(req.getAllResponseHeaders()),
      data: req.response || req.responseText,
    };

    if (res.status >= 200 && res.status < 300) {
      callback(null, res);
    }
    else if (res.status < 200 || res.status < 400) {
      callback(ono('Invalid/unsupported HTTP %d response', res.status));
    }
    else {
      callback(ono('HTTP %d error occurred (%s)', res.status, req.statusText));
    }
  }

  function handleError (err) {
    callback(err);
  }
}

/**
 * Returns the HTTP response status, accounting for certain edge cases
 *
 * @param {number} status - The {@link XMLHttpRequest#status} property
 * @param {string} url - The URL that was requested
 * @returns {number}
 */
function getResponseStatus (status, url) {
  if (status === 1223) {
    // IE9 returns 1223 instead of 204
    // https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    return 204;
  }
  else if (status) {
    return status;
  }
  else if (url.substr(0, 5) === 'file:') {
    // file:// protocol doesn't use response codes, so emulate a 200 response
    return 200;
  }
  else {
    // No status. Probably a network error.
    return 0;
  }
}

/**
 * Parses HTTP response headers, and returns them as an object with header names as keys
 * and header values as values.
 *
 * @param {?string} headers - Response headers, separated by CRLF
 * @returns {object}
 */
function parseResponseHeaders (headers) {
  var parsed = {};

  if (headers) {
    headers.split('\n').forEach(function (line) {
      var separatorIndex = line.indexOf(':');
      var key = line.substr(0, separatorIndex).trim().toLowerCase();
      var value = line.substr(separatorIndex + 1).trim().toLowerCase();

      if (key) {
        parsed[key] = value;
      }
    });
  }

  return parsed;
}
