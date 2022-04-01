'use strict';

/**
 * RichTextMaterial
 * @class
 */

const Material = require('./material');
const { utils, createCanvas, createImageData } = require('../../inkpaint/lib/index');
const { isBrowser } = require("browser-or-node");

class RichTextMaterial extends Material {

  async init() {
    const { width, height } = this.conf;

    let html = this.conf.html;
    let style = `width: ${width}px; `; // height: ${height}px;
    if (typeof(html) === 'object' && html.innerHTML) {
      if (typeof(html.style) === 'string') style += html.style;
      html = html.innerHTML;
    }

    if (isBrowser) await this.browserRender(html, style);
    else await this.nodeRender();

    this.info = { width: this.canvas.width, height: this.canvas.height };
  }

  async nodeRender(html, style) {
    console.log('nodeRender', html, style);
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
    document.body.removeChild(container);

    const debug_ctr = document.getElementById('mira-player-debug-richtext');
    if (debug_ctr) debug_ctr.appendChild(this.canvas);
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