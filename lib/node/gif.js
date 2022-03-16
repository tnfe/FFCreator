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
const GifMaterial = require('../material/gif');

class FFGifImage extends FFImage {

  constructor(conf = { list: [] }) {
    super({ type: 'gif', ...conf });
    this.currentTime = 0;
    this.loops = 0;
    this.loop = conf.loop === undefined ? true : conf.loop;
  }

  createMaterial(conf) {
    return new GifMaterial(conf);
  }

  async preProcessing() {
    await super.preProcessing();
    this.setSpeed(this.conf.speed);
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

  async initDraw() {
    const texture = await this.material.getFrameByTime(0);
    this.draw({ texture });
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
    let loops = 0;
    while (this.loop && this.currentTime >= matDuration) {
      this.currentTime = Math.max(0.0, this.currentTime - matDuration);
      loops++;
    }

    // console.log(`${this.type} drawing`, {id:this.id, timeInMs, nextDeltaInMS, tt: this.currentTime, matDuration, pst: this.parent.startTime});
    // loops每次变化的时候，需要seek
    if (this.loops !== loops) {
      this.material.jumpTo(this.currentTime);
      this.loops = loops;
    }

    texture = this.material.getFrameByTime(this.currentTime, nextDeltaInMS / 1000);
    // no need to update browser render, canvas->texture binded when preProcessing
    if (!isBrowser) this.draw({texture: await texture, useCache: this.useCache});
    // nextDeltaInMS > 0 播放状态，就不让外面等texture渲染了；反之seek状态时，要await确保外面拿到正确的帧
    return nextDeltaInMS > 0 || await texture;
  }
}

module.exports = FFGifImage;
