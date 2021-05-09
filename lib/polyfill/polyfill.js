'use strict';

/**
 * Polyfill - any Polyfill methods in node.js environment
 *
 * @function
 */
const { ENV } = require('spritejs');
const { isNode } = require('browser-or-node');
const fixRequestAnimationFrame = require('./raf');
const { polyfill } = require('spritejs/lib/platform/node-canvas');

const Polyfill = () => {
  if (isNode) {
    polyfill({ ENV });
    fixRequestAnimationFrame();
  }
};

module.exports = Polyfill;
