'use strict';

/**
 * FFGIfImage - A Component that supports gif animation
 *
 * ####Example:
 *
 *     const path = path.join(__dirname, './sun.gif');
 *     const gif = new FFGIfImage({ path, x: 320, y: 520 });
 *     gif.setSpeed(2);
 *
 * @class
 */

const { isBrowser } = require("browser-or-node");
const FFImage = require('./image');
const { Sprite, Texture } = require('inkpaint');
const GifMaterial = require('../material/gif');

class FFGifImage extends FFImage {

  constructor(conf = { list: [] }) {
    super({ type: 'gif', ...conf });
    this.loop = conf.loop === undefined ? true : conf.loop;
    this.material = this.createMaterial(this.conf);
  }

  createMaterial(conf) {
    return new GifMaterial(conf);
  }

  /**
   * Set whether to loop the animation
   * @param {boolean} loop whether loop
   *
   * @public
   */
  setLoop(loop) {
    this.loop = loop;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = new Sprite(Texture.newEmpty());
    this.setAnchor(0.5);
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    await super.preProcessing();
    // calc container duration
    const duration = this.getDuration();
    const fps = this.rootConf('fps');
    await this.material.init({ duration, fps });
    if (isBrowser) {
      // browser render: display.texture -> canvas
      this.display.attr({ texture: Texture.fromCanvas(this.material.canvas) });
    }
  }

  /**
   * Get the URL that needs to be preloaded
   * @public
   */
  getPreloadUrls() {
    // const url = this.materials.getFrame(0);
    // return [url]; // for first frame as cover
  }

  initDraw() {
    if (!isBrowser) this.drawFirstFrame();
  }

  /**
   * draw the first image
   * @private
   */
  drawFirstFrame() {
    const url = this.material.getFrame(0);
    const texture = this.getAsset(url);
    this.draw({ texture });
    this.setDisplaySize();
  }

  /**
   * Functions for drawing images
   * @private
   */
  async drawing(timeInMs, nextDeltaInMS) {
    let texture = await super.drawing(timeInMs, nextDeltaInMS);
    if (!texture) return false;
    const lifetime = this.lifetime();
    // timeInMs 是绝对时间，需要先相对parent求相对时间 sceneTime
    const sceneTime = (timeInMs / 1000) - this.parent.startTime;
    if (sceneTime < lifetime.start || sceneTime >= lifetime.end) return false;

    // currentTime是当前素材的时间
    this.currentTime = sceneTime - lifetime.start;
    const matDuration = this.material.getDuration();
    while (this.loop && this.currentTime >= matDuration) {
      this.currentTime = Math.max(0.0, this.currentTime - matDuration);
    }

    // todo: support speed
    // console.log(`${this.type} drawing`, {id:this.id, timeInMs, nextDeltaInMS, tt: this.currentTime, matDuration, pst: this.parent.startTime});
    texture = this.material.getFrameByTime(this.currentTime);
    // no need to update browser render, canvas->texture binded when preProcessing
    if (!isBrowser) this.display.updateBaseTexture(await texture, this.useCache);
    // nextDeltaInMS > 0 播放状态，就不让外面等texture渲染了；反之seek状态时，要await确保外面拿到正确的帧
    return nextDeltaInMS > 0 || await texture;
  }

  destroy() {
    this.material.destroy();
    super.destroy();
  }
}

module.exports = FFGifImage;
