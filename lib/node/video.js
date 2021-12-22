'use strict';

/**
 * FFVideo - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideo({ path, width: 500, height: 350 });
 *     video.setAudio(true);
 *     video.setTimes("00:00:43", "00:00:50");
 *     scene.addChild(video);
 *
 *
 * ####Note
 *     https://spritejs.org/demo/#/video
 *
 * @class
 */

const { isBrowser } = require("browser-or-node");
const FFGifImage = require('./gif');
const FFAudio = require('../audio/audio');
const FFLogger = require('../utils/logger');
const VideoMaterial = require('../material/video');
const { Texture, BaseTexture } = require('inkpaint');

class FFVideo extends FFGifImage {
  constructor(conf) {
    super({ type: 'video', ...conf });
    if (!conf.width)
      FFLogger.error({ pos: 'FFVideo', error: 'This component must enter the width!' });

    this.currentTime = 0;
    this.preload = false;
    this.useCache = false;
    this.audio = conf.audio === undefined ? true : conf.audio;
  }

  /**
   * Create Material, called by super.constructor
   * @return {Material} material
   * @protected
   */
  createMaterial(conf) {
    return new VideoMaterial(conf);
  }

  /**
   * Get display object width and height
   * @return {array} [width, height]
   * @public
   */
  getWH() {
    const { width = 50, height = 50 } = this.conf;
    return [width, height];
  }

  /**
   * Whether to play sound
   * @param {boolean} audio - Whether to play sound
   * @public
   */
  setAudio(audio = true) {
    this.audio = audio;
  }

  /**
   * Create display object.
   * @private
   */
  createDisplay() {
    super.createDisplay();
    const [width, height] = this.getWH();
    this.display.attr({ width, height });
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    await super.preProcessing();
    if (!isBrowser) {
      // back-end render
      const dir = this.rootConf('detailedCacheDir');
      if (this.audio) {
        const audioPath = await this.material.extractAudio(dir, `${this.id}_audio`);
        // todo: more audio config like volumn...
        this.addAudioToScene(audioPath);
      }
      await this.material.extractVideo(dir, `${this.id}_video`);
    }
  }

  /**
   * Pause rendering by scene over
   * @private
   */
  end() {
    this.material && this.material.pause();
  }

  async drawing(timeInMs, nextDeltaInMS) {
    const texture = await super.drawing(timeInMs, nextDeltaInMS);
    if (!texture) return this.material.pause();
    const matDuration = this.material.getDuration();
    if (nextDeltaInMS) {
      const nextTime = this.currentTime + (nextDeltaInMS / 1000);
      if (nextTime >= matDuration) {
        this.material.pause(); // pause to seek 0 loop;
      } else {
        this.material.prepare(nextTime);
      }
    } else {
      this.material.pause();
    }
    return texture;
  }

  /**
   * draw the first cover image, called by super.initDraw
   * @protected
   */
  drawFirstFrame() {
    // todo: maybe should remove...
    const { display } = this;
    const [width, height] = this.getWH();
    const frame = this.material.getSourceRect(width, height);
    const texture = new Texture(new BaseTexture(), frame);

    display.texture = texture;
    display.attr({ width, height });
    display.setScaleToInit();

    this.drawing();
  }

  addAudioToScene(path) {
    if (!this.parent) return;
    const audio = new FFAudio({
      path: path,
      start: this.getDelayTime(),
      loop: this.loop,
    });
    this.parent.addAudio(audio);
  }
}

module.exports = FFVideo;
