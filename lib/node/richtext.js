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
const { nodeRequire } = require('../utils/utils');

const fontMap = {
  '.svg': {
    mediaType: 'image/svg+xml',
    format: 'svg',
  },
  '.ttf': {
    mediaType: 'font/truetype',
    format: 'truetype',
  },
  '.otf': {
    mediaType: 'font/opentype',
    format: 'opentype',
  },
  '.eot': {
    mediaType: 'application/vnd.ms-fontobject',
    format: 'embedded-opentype',
  },
  '.sfnt': {
    mediaType: 'application/font-sfnt',
    format: 'sfnt',
  },
  '.woff2': {
    mediaType: 'application/font-woff2',
    format: 'woff2',
  },
  '.woff': {
    mediaType: 'application/font-woff',
    format: 'woff',
  },
};

class FFRichText extends FFImage {
  constructor(conf) {
    super({ type: 'richtext', ...conf });
  }

  createMaterial(conf) {
    if (!isBrowser) {
      const cacheDir = this.rootConf('detailedCacheDir');
      const cacheFile = `rt_${this.id}`;
      conf = {...conf, cacheDir, cacheFile};
    }
    return new RichTextMaterial(conf);
  }

  base64path(path) {
    const fs = nodeRequire('fs');
    const buff = fs.readFileSync(path);
    const base64 = buff.toString('base64');
    const meta = this.fontMeta(path);
    return `data:${meta.mediaType};charset=utf-8;base64,${base64}`;
  }

  fontFormat(fontData) {
    const meta = this.fontMeta(fontData.src);
    return fontData.format || (meta && meta.format);
  }

  fontMeta(url) {
    const ext = url.split('.').slice(-1)[0].toLowerCase();
    return fontMap[`.${ext}`] || { format: ext };
  }

  destroy() {
    super.destroy();
  }
}

module.exports = FFRichText;
