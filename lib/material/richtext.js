'use strict';

/**
 * RichTextMaterial
 * @class
 */

const ImageMaterial = require('./image');
const { utils, createCanvas, createImageData } = require('../../inkpaint/lib/index');
const { isBrowser } = require("browser-or-node");
const { nodeRequire } = require('../utils/utils');

const RESET_CSS = `
* {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
  line-height: 150%;
  letter-spacing:0px;
}
article, aside, details, figcaption, figure, div, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
`;

class RichTextMaterial extends ImageMaterial {

  async init() {
    const { width, height } = this.conf;

    let html = this.conf.html;
    // todo: default style 确保前后端一致
    let style = `font-size:15px;width:${width}px;`; // height: ${height}px;
    if (typeof(html) === 'object' && html.innerHTML) {
      if (typeof(html.style) === 'string') style += html.style;
      html = html.innerHTML;
    }
    if (!html) return;

    let fontStyle = '';
    if (this.conf.font) {
      const fonts = Array.isArray(this.conf.font) ? this.conf.font : [this.conf.font];
      for (const font of fonts) {
        if (!font.name || !font.src || !font.format) continue;
        fontStyle += `@font-face {
          font-family: '${font.name}';
          src: url('${font.src}') format('${font.format}');
        }\n`;
      }
    }

    // reset css
    html = `<style>${RESET_CSS}\n${fontStyle}</style>` + html;

    if (isBrowser) await this.browserRender(html, style);
    else await this.nodeRender(html, style);
  }

  async nodeRender(html, style) {
    const nodeHtmlToImage = nodeRequire('node-html-to-image');
    const id = 'mirap-node-to-image-container';
    this.path = this.getOutputPath(this.conf.cacheDir, `${this.conf.cacheFile}.png`);
    await nodeHtmlToImage({
      output: this.path,
      transparent: true,
      puppeteerArgs: {
        // ScaleFactor，高清一些
        defaultViewport: { deviceScaleFactor: 2, width: 1024, height: 768 }
      },
      selector: `div#${id}`,
      html: `<html><body><div id="${id}" style="${style}">${html}</div></body></html>`
    });
    await super.init();
    // console.log('nodeRender!!!', this.info);
  }

  async browserRender(html, style) {
    const html2canvas = require("html2canvas");
    const container = document.createElement('div');
    const div = document.createElement('div');
    container.style = "width: 0; height: 0; overflow: hidden;";
    // todo: 需要处理自适应高度的情况
    div.style = style;
    div.innerHTML = html;
    container.appendChild(div);

    document.body.appendChild(container);
    this.canvas = await html2canvas(div, { backgroundColor: null });
    this.info = { width: this.canvas.width, height: this.canvas.height };
    document.body.removeChild(container);

    const debug_ctr = document.getElementById('mira-player-debug-richtext');
    if (debug_ctr) debug_ctr.appendChild(this.canvas);
    // console.log('browserRender!!!', this.info);
  }

  width() {
    // todo: 处理 crop rect 逻辑
    return this.info.width || 0;
  }

  height() {
    return this.info.height || 0;
  }

  destroy() {
    super.destroy();
    if (this.tmpCanvas) {
      this.tmpCanvas = null;
      this.tmpCanvasContext = null;
    }
  }
}

module.exports = RichTextMaterial;