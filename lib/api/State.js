'use strict';

var Schema = require('./Schema');
var Plugins = require('./Plugins');

module.exports = State;

/**
 * The state for a {@link JsonSchemaLib} operation.  An "operation" is a single method
 * invocation, such as {@link JsonSchemaLib#read} or {@link JsonSchemaLib#dereference}.
 *
 * @param {Config} config - The configuration for this operation
 *
 * @class
 */
function State (config) {
  /**
   * The configuration for this operation.
   *
   * @type {Config}
   */
  this.config = config;

  /**
   * The plugins to use for this operation.
   *
   * @type {Plugins}
   */
  this.plugins = new Plugins(this);

  /**
   * The {@link Schema} that will be
   */
  var schema = state.schema = new Schema(state);
}
