'use strict';

/**
 * FFCon - display object container.
 *
 * ####Example:
 *
 *     class FFScene extends FFCon
 *
 * @class
 */
const Pool = require('../core/pool');
const {Layer} = require('spritejs');
const FFBase = require('../core/base');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');

class FFCon extends FFBase {
  constructor(conf) {
    super({type: 'con', ...conf});
    this.children = [];
    this.createDisplay();
  }

  /**
   * Create display object
   * @private
   */
  createDisplay() {
    this.display = Pool.get(this.type, () => {
      const layer = new Layer({
        autoRender: false,
        contextType: 'webgl',
        alpha: true,
      });

      const gl = layer.gl;
      gl.blendEquation(gl.FUNC_ADD);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      return layer;
    });

    this.display.attr({bgcolor: undefined});
  }

  start() {}

  /**
   * Add child elements
   * @param {FFNode} child - node object
   * @public
   */
  addChild(child) {
    this.display.appendChild(child.display);
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Clear all child elements and add unique elements
   * @param {FFNode} child - node object
   * @public
   */
  addOnlyDisplayChild(child) {
    this.display.removeAllChildren();
    this.display.appendChild(child.display);
  }

  /**
   * Remove child elements
   * @param {FFNode} child - node object
   * @public
   */
  removeChild(child) {
    child.parent = null;
    this.display.removeChild(child.display);
    Utils.deleteArrayElement(this.children, child);
  }

  destroy() {
    forEach(this.children, child => child.destroy());
    this.children.length = 0;
    this.display.removeAllChildren();
    super.destroy();

    //Pool.put(this.type, this.display);
  }
}

module.exports = FFCon;
