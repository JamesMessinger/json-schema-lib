/**
 * This script exposes test dependencies as globals. This saves us from having to `require()`
 * them in every spec file, and also allows the same spec files to work in Node.js and web browsers.
 */
(function () {
  'use strict';

  if (host.browser) {
    // Expose Browser globals
    window.expect = chai.expect;
  }
  else {
    // Expose Node globals
    global.JsonSchema = require('../../');
    global.expect = require('chai').expect;
  }

}());
