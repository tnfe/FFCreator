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
const { Layer } = require('spritejs');
const FFBase = require('../core/base');
const GLUtil = require('../utils/gl');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');

class FFCon extends FFBase {
  constructor(conf) {
    super({ type: 'con', ...conf });
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
      GLUtil.enableBlendMode(gl);
      return layer;
    });

    this.display.attr({ bgcolor: undefined });
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
   * @param {FFNode} children - any node object
   * @public
   */
  addOnlyDisplayChild(...children) {
    this.display.removeAllChildren();
    forEach(children, child => this.display.appendChild(child.display));
  }

  /**
   * Show only display child object
   * @param {FFNode} child - node object
   * @public
   */
  showOnlyDisplayChild(scene) {
    forEach(this.display.children, child => {
      child.hide();
      scene.display.show();
    });
  }

  removeAllDisplayChildren(){
    this.display.removeAllChildren();
  }

  addDisplayChild(child) {
    this.display.appendChild(child.display);
  }

  removeDisplayChild(child) {
    this.display.removeChild(child.display);
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

    // Pool.put(this.type, this.display);
  }
}

module.exports = FFCon;
