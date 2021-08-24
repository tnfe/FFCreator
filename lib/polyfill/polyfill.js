'use strict';

/**
 * Polyfill - any Polyfill methods in node.js environment
 *
 * @function
 */
const { isNode } = require('browser-or-node');
// const fixRequestAnimationFrame = require('./raf');

const Polyfill = () => {
  if (isNode) {
    // fixRequestAnimationFrame();
  }
};

module.exports = Polyfill;
