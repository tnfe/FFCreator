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
const { Texture } = require('inkpaint');
const GifMaterial = require('../material/gif');

class FFGifImage extends FFImage {

  constructor(conf = { list: [] }) {
    super({ type: 'gif', ...conf });
    this.currentTime = 0;
    this.loop = conf.loop === undefined ? true : conf.loop;
    this.cloneTexture = false;
    this.setSpeed(conf.speed);
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

  setSpeed(speed) {
    this.material.speed = speed > 0 ? Number(speed) : 1.0;
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    await super.preProcessing();
    this.display.attr({ texture: Texture.fromCanvas(this.material.canvas) });
    this.fitTexture();
  }

  async initDraw() {
    const texture = await this.material.getFrameByTime(0);
    this.draw({ texture, update: false });
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
    if (!isBrowser) this.draw({texture: await texture});
    // nextDeltaInMS > 0 播放状态，就不让外面等texture渲染了；反之seek状态时，要await确保外面拿到正确的帧
    return nextDeltaInMS > 0 || await texture;
  }
}

module.exports = FFGifImage;
