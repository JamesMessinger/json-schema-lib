'use strict';

exports.__plugins = createSymbol('__plugins');

/**
 * Returns a {@link Symbol} if supported by the current runtime environment;
 * otherwise, returns a string property key.
 *
 * @param {string} name - The name of the symbol or string property key
 * @returns {Symbol|string}
 */
function createSymbol (name) {
  if (typeof Symbol === 'function') {
    return Symbol(name);
  }
  else {
    return name;
  }
}
