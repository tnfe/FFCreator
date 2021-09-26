'use strict';

/**
 * FFText - Text component-based display component
 *
 * ####Example:
 *
 *     const text = new FFText({ text: "hello world", x: 400, y: 300 });
 *     text.setColor("#ffffff");
 *     text.setBackgroundColor("#000000");
 *     text.addEffect("fadeIn", 1, 1);
 *     scene.addChild(text);
 *
 * @class
 */
const FFNode = require('./node');
const isArray = require('lodash/isArray');
const CanvasUtil = require('../utils/canvas');
const { ProxyObj, Text } = require('inkpaint');

class FFText extends FFNode {
  constructor(conf = { text: '', style: { fontSize: 28 } }) {
    super({ type: 'text', ...conf });
  }

  /**
   * Functions for drawing images
   * @private
   */
  createDisplay() {
    const { text, fontSize = 36, color = '#000000' } = this.conf;
    this.display = new ProxyObj();
    // this.setAnchor(0.5);
    this.display.text = text;
    this.display.updateStyle({ fontSize, fill: color });
  }

  /**
   * Set text value
   * @param {string} text - text value
   * @public
   */
  setText(text) {
    this.conf.text = text;
    this.display.text = text;
  }

  /**
   * Set background color
   * @param {string} backgroundColor - the background color value
   * @public
   */
  setBackgroundColor(backgroundColor) {
    this.display.updateStyle({ backgroundColor });
  }

  /**
   * Set text color value
   * @param {string} color - the text color value
   * @public
   */
  setColor(color) {
    this.display.updateStyle({ fill: color });
  }

  /**
   * Set text font file path
   * @param {string} font - text font file path
   * @public
   */
  setFont(font) {
    CanvasUtil.setFont(font, fontFamily => this.setStyle({ fontFamily }));
  }

  /**
   * Set text style by object
   * @param {object} style - style by object
   * @public
   */
  setStyle(style) {
    this.updateStyle(style);
  }

  updateStyle(style) {
    if (style.color) style.fill = style.color;
    if (isArray(style.padding)) style.padding = style.padding[0];
    this.display.updateStyle(style);
  }

  setWrap(warpWidth) {
    this.setStyle({
      wordWrap: true,
      wordWrapWidth: warpWidth,
    });
  }

  /**
   * replace to real Text Component
   * @private
   */
  substituteText() {
    const proxyObj = this.display;
    this.display = new Text();
    this.display.substitute(proxyObj);
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    this.substituteText();
    super.start();
  }

  /**
   * Set Text horizontal center function
   * @public
   */
  alignCenter() {
    this.setAnchor(0.5);
    this.setStyle({ align: 'center' });
  }

  destroy() {
    this.display.text = '';
    super.destroy();
  }
}

module.exports = FFText;
