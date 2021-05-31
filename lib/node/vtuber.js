'use strict';

/**
 * FFVtuber - A simple virtual anchor component
 *
 * ####Example:
 *
 *     const vtuber = new FFVtuber({ x: 320, y: 520 });
 *     vtuber.setPath(vpath, 1, 7);    // 从第1-7.png
 *     vtuber.setSpeed(6);
 *
 * @class
 */
const FFImage = require('./image');
const Pool = require('../core/pool');
const clone = require('lodash/clone');
const { Sprite } = require('spritejs');
const Utils = require('../utils/utils');
const TimelineUpdate = require('../timeline/update');
const Materials = require('../utils/materials');

class FFVtuber extends FFImage {
  constructor(conf = { list: [] }) {
    super({ type: 'vtuber', ...conf });

    this.time = 0;
    this.index = 0;
    this.frameIndex = 0;
    this.texture = null;
    this.state = 'stop';
    this.materials = new Materials();
    this.conf.speed = this.conf.speed || 6;
  }

  /**
   * Get a cloned object
   * @return {FFVtuber} cloned object
   * @public
   */
  clone() {
    const conf = clone(this.conf);
    const vtuber = new FFVtuber(conf);
    vtuber.materials = this.materials.clone();
    this.frameIndex = vtuber.materials.start;

    return vtuber;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    this.display = Pool.get(this.type, () => new Sprite());
    this.setAnchor(0.5);
  }

  /**
   * Set up an animated sprite texture
   * @param {string} texture - animated sprite texture
   * @param {string} json - sprite texture data map
   * @public
   */
  setTexturePacker(texture, json) {
    this.setTexture(texture, json);
  }

  /**
   * Set up an animated sprite texture
   * @param {string} texture - animated sprite texture
   * @param {string} json - sprite texture data map
   * @public
   */
  setTexture(texture, json) {
    this.texture = new TexturePacker({ texture, json });
  }

  setPath(path, start, end) {
    this.materials.path = path;
    this.materials.start = start;
    this.materials.end = end;
    this.frameIndex = start;
  }

  /**
   * Set component playback speed
   * @param {number} speed - Play speed
   * @public
   */
  setSpeed(speed) {
    this.conf.speed = speed;
  }

  /**
   * Set animation schedule cycle
   * [[0, 3.2], [0, 5]]
   * @param {array} period - [0, 3.2]
   * @public
   */
  setPeriod(period) {
    this.conf.period = period;
  }

  /**
   * Get animation schedule cycle
   * @return {array} period - [0, 3.2]
   * @public
   */
  getPeriod() {
    return this.conf.period;
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    super.start();
    this.time = 0;
    this.drawFistFrame();
    this.addTimelineCallback();
    this.play();
  }

  play() {
    this.state = 'play';
  }

  stop() {
    this.drawFistFrame();
    this.state = 'stop';
  }

  /**
   * draw the first image
   * @private
   */
  drawFistFrame() {
    this.frameIndex = this.materials.start;
    const texture = this.materials.getFrame2(this.frameIndex);
    this.draw({ texture });
  }

  addTimelineCallback() {
    this.drawing = this.drawing.bind(this);
    TimelineUpdate.addFrameCallback(this.drawing);
  }

  /**
   * Functions for drawing images
   * @private
   */
  drawing(time, delta) {
    this.checkState(time, delta);
    if (this.state === 'stop') return;

    if (this.frameIndex > this.materials.end || this.frameIndex < this.materials.start)
      this.frameIndex = this.materials.start;

    const texture = this.materials.getFrame2(this.frameIndex);
    this.draw({ texture });
    this.nextFrame();
  }

  /**
   * Check play or stop state
   * @private
   */
  checkState(time, delta) {
    this.time += delta;
    const period = this.conf.period;

    if (period && !Utils.isArray2D(period)) {
      const start = period[0] * 1000;
      const end = period[1] * 1000;

      if (this.time >= start && this.time <= end) {
        this.play();
      } else {
        this.stop();
      }
    }
  }

  /**
   * draw the next frame
   * @private
   */
  nextFrame() {
    this.index++;
    if (this.index >= this.conf.speed) {
      this.index = 0;
      this.frameIndex++;
    }
  }

  isReady() {
    return new Promise(resolve => setTimeout(resolve, 1));
  }

  destroy() {
    this.texture = null;
    TimelineUpdate.removeFrameCallback(this.drawing);
    this.materials.destroy();
    super.destroy();
  }
}

class TexturePacker {
  constructor({ texture, json }) {
    this.texture = texture;
    this.json = json;
  }

  toArray() {
    return [this.texture, this.json];
  }
}

module.exports = FFVtuber;
