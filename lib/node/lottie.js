'use strict';

/**
 * FFLottie - Lottie-node is an API for runnig Lottie with the canvas renderer in Node.js, with the help of node-canvas.
 * This is intended for rendering Lottie animations to images or video.
 *
 * #### Example:
 *
 *    const flottie = new FFLottie({ file, loop, width: 600, height: 500 });
 *    flottie.goToAndStop(15);
 *    flottie.replaceAsset(17, path.join(__dirname, 'xx.jpg'));
 *
 *
 * #### Note
 *     https://github.com/drawcall/lottie-node
 *
 * @class
 *
 */
const FFImage = require('./image');
const lottie = require('lottie-nodejs');
const CanvasUtil = require('../utils/canvas');
const TimelineUpdate = require('../timeline/update');
const { Canvas, Image, Texture } = require('inkpaint');

class FFLottie extends FFImage {
  constructor(conf = {}) {
    super({ type: 'lottie', ...conf });

    const { data = null, file, filepath, loop = false } = this.conf;
    this.data = data;
    this.loop = loop;
    this.file = file || filepath;

    this.updateCallback = this.updateCallback.bind(this);
    this.initLottie();
  }

  /**
   * Get the width and height of the chart component
   * @return {array} [width, height] array
   * @public
   */
  getWH() {
    const { width = 500, height = 500 } = this.conf;
    return [width, height];
  }

  /**
   * Set text font file path
   * @param {string} font - text font file path
   * @public
   */
  setFont(font) {
    CanvasUtil.setFont(font, fontFamily => (this.ctx.font = fontFamily));
  }

  /**
   * Modify the Image in the lottie json data.
   * @param {number|string} id - id of the material
   * @param {string} path - new material path
   * @param {boolean} absolute - absolute path or relative path
   * @public
   */
  replaceAsset(id, path, absolute = true) {
    this.ani.replaceAsset(id, path, absolute);
  }

  /**
   * Modify the Text in the lottie json data.
   * @param {string} target - the target value
   * @param {string} path - new txt value
   * @public
   */
  replaceText(target, txt) {
    this.ani.replaceText(target, txt);
  }

  /**
   * Find a specific layer element
   * @param {string} key - the key value
   * @public
   */
  findElements(key) {
    return this.ani.findElements(key);
  }

  /**
   * get lottie-api instance
   * @public
   */
  getApi() {
    return this.ani.api;
  }

  /**
   * Initialize the Lottie instance
   * @private
   */
  initLottie() {
    const { loop, data, file } = this;
    const [width, height] = this.getWH();

    const canvas = new Canvas(width, height);
    lottie.setCanvas({
      Canvas,
      Image,
    });

    const ani = lottie.loadAnimation(
      {
        container: canvas,
        path: file,
        loop,
        animationData: data,
      },
      false,
    );

    this.ani = ani;
    this.canvas = canvas;
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    this.initTexture();
    this.ani.loadNow();
    this.animations.start();
    TimelineUpdate.addFrameCallback(this.updateCallback);
  }

  initTexture() {
    const { canvas, display } = this;

    const scale = display.scale.clone();
    display.texture = Texture.fromCanvas(canvas);
    this.setDisplaySize();
    display.scale.copy(scale);
    display.setScaleToInit();
  }

  updateCallback(time, delta) {
    this.ani.render(delta);
  }

  destroy() {
    TimelineUpdate.removeFrameCallback(this.updateCallback);
    super.destroy();
    if (this.ani) this.ani.destroy();

    this.updateCallback = null;
    this.canvas = null;
    this.ani = null;
    this.data = null;
    this.file = null;
  }
}

module.exports = FFLottie;
