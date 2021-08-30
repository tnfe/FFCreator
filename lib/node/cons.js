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
const FFBase = require('../core/base');
// const GLUtil = require('../utils/gl');
const Utils = require('../utils/utils');
const forEach = require('lodash/forEach');
const { Container, ProxyObj } = require('inkpaint');

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
    this.display = new Container();
  }

  start() {}

  /**
   * Add child elements
   * @param {FFNode} child - node object
   * @public
   */
  addChild(child) {
    this.display.addChild(child.display);
    child.parent = this;
    this.children.push(child);
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

  /**
   * Clear all child elements and add unique elements
   * @param {FFNode} children - any node object
   * @public
   */
  addOnlyDisplayChild(...children) {
    this.removeAllDisplayChildren();
    forEach(children, child => this.display.addChild(child.display));
  }

  /**
   * Show only display child object
   * @param {FFNode} child - node object
   * @public
   */
  showOnlyDisplayChild(scene) {
    forEach(this.display.children, child => {
      child.visible = false;
      scene.display.visible = true;
    });
  }

  removeAllDisplayChildren() {
    const { display } = this;
    for (let i = display.children.length - 1; i >= 0; i--) {
      const child = display.children[i];
      if (child instanceof ProxyObj) continue;

      display.removeChild(display.children[i]);
    }
  }

  addDisplayChild(child) {
    this.display.addChild(child.display);
  }

  removeDisplayChild(child) {
    this.display.removeChild(child.display);
  }

  destroy() {
    forEach(this.children, child => child.destroy());
    this.removeAllDisplayChildren();
    super.destroy();

    this.children.length = 0;
    this.children = null;
    this.display = null;
  }
}

module.exports = FFCon;
