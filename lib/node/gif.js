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

  get default() {
    const _default = super.default;
    return {
      startTime: _default.startTime,
      endTime: this.loop ? _default.endTime : undefined,
      duration: this.loop ? undefined : this.material.length,
    }
  }

  createMaterial(conf) {
    const speed = Number(this.conf.speed) || 1.0;
    return new GifMaterial({speed, ...conf});
  }

  /**
   * Set whether to loop the animation
   * @param {boolean} loop whether loop
   *
   * @public
   */
  setLoop(loop) {
    this.loop = !!loop;
    if (this.material) this.material.loop = this.loop;
  }

  setSpeed(speed) {
    this.conf.speed = Number(speed) || 1.0;
    if (this.material) this.material.speed = this.conf.speed;
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

    // timeInMs 是绝对时间，currentTime是当前素材的时间
    this.currentTime = (timeInMs / 1000) - this.absStartTime;
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
    if (isBrowser) this.display.texture.baseTexture.update();
    else this.draw({texture: await texture, useCache: this.useCache});
    // nextDeltaInMS > 0 播放状态，就不让外面等texture渲染了；反之seek状态时，要await确保外面拿到正确的帧
    return nextDeltaInMS > 0 || await texture;
  }
}

module.exports = FFGifImage;
