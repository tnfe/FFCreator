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
const FFImage = require('./image');
const RichTextMaterial = require('../material/richtext');
const { Sprite, Texture, Rectangle, createCanvas } = require('../../inkpaint/lib/index');
const { isBrowser } = require("browser-or-node");

class FFRichText extends FFImage {
  constructor(conf) {
    super({ type: 'richtext', ...conf });
  }

  createMaterial(conf) {
    return new RichTextMaterial(conf);
  }

  destroy() {
    super.destroy();
  }
}

module.exports = FFRichText;
