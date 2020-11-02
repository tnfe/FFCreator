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
const Pool = require('../core/pool');
const {Label} = require('spritejs');

class FFText extends FFNode {
  constructor(conf = {text: '', style: {fontSize: 28}}) {
    super({type: 'text', ...conf});
  }

  /**
   * Functions for drawing images
   * @private
   */
  createDisplay() {
    const {text, fontSize = 36} = this.conf;
    this.display = Pool.get(this.text, () => new Label());
    this.display.attr({text, fontSize});
  }

  /**
   * Set text value
   * @param {string} text - text value
   * @public
   */
  setText(text) {
    this.conf.text = text;
    this.display.attr({text});
  }

  /**
   * Set background color
   * @param {string} backgroundColor - the background color value
   * @public
   */
  setBackgroundColor(backgroundColor) {
    this.display.attr({bgcolor: backgroundColor});
  }

  /**
   * Set text color value
   * @param {string} color - the text color value
   * @public
   */
  setColor(color) {
    this.display.attr({fillColor: color});
  }

  /**
   * Set text font file path
   * @param {string} file - text font file path
   * @public
   */
  setFont(file) {
    this.display.attr({fontFamily: file});
  }

  /**
   * Set text style by object
   * @param {object} style - style by object
   * @public
   */
  setStyle(style) {
    if (style.color) style.fillColor = style.color;
    if (style.backgroundColor) style.bgcolor = style.backgroundColor;

    this.display.attr(style);
  }

  /**
   * Set Text horizontal center function
   * @public
   */
  alignCenter() {
    this.setAnchor(0.5);
    this.setStyle({textAlign: 'center'});
  }

  destroy() {
    this.display.attr({text: ''});
    super.destroy();
  }
}

module.exports = FFText;
