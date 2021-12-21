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

const FFImage = require('./image');
const FFAudio = require('../audio/audio');
const FFLogger = require('../utils/logger');
const Materials = require('../utils/materials');
const TimelineUpdate = require('../timeline/update');
const { Sprite, Texture, BaseTexture } = require('inkpaint');

class FFVideo extends FFImage {
  constructor(conf) {
    super({ type: 'video', ...conf });
    if (!conf.width)
      FFLogger.error({ pos: 'FFVideo', error: 'This component must enter the width!' });

    this.materials = new Materials(conf);
    this.currentTime = 0;
    this.preload = false;
    this.useCache = false;
    this.audio = conf.audio === undefined ? true : conf.audio;
    this.loop = conf.loop === undefined ? false : conf.loop;
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
   * Whether to loop the video
   * @param {boolean} audio - Whether to loop the video
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
    const [width, height] = this.getWH();
    this.display = new Sprite();
    this.display.attr({ width, height });
    this.setAnchor(0.5);
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    this.backendRender = !this.rootConf('canvas');
    const material = this.materials;
    const mode = this.backendRender ? Materials.MODE_BACKEND : Materials.MODE_FRONTEND;

    // calc container duration
    const duration = this.getDuration();
    const fps = this.rootConf('fps');
    await material.init({
      mode, duration, fps,
    });

    if (this.backendRender) {
      // back-end render
      const dir = this.rootConf('detailedCacheDir');
      if (this.audio) {
        const audioPath = await material.extractAudio(dir, `${this.id}_audio`);
        // todo: more audio config like volumn...
        this.addAudioToScene(audioPath);
      }
      await material.extractVideo(dir, `${this.id}_video`);
    } else {
      // front-end render: display.texture -> canvas
      this.display.attr({ texture: Texture.fromCanvas(material.canvas) });
    }
  }

  /**
   * Start rendering
   * @private
   */
  start() {
    if (this.started) return;
    this.started = true; // lock for once
    if (this.backendRender) this.drawCoverImage();
    this.animations.start();
    this.addTimelineCallback();
  }

  /**
   * Pause rendering by scene over
   * @private
   */
  end() {
    this.materials && this.materials.pause();
  }

  /**
   * Functions for drawing images
   * @private
   */
  async drawing(timeInMs = 0, nextDeltaInMS = 0) {
    super.drawing(timeInMs, nextDeltaInMS);
    if (!this.parent.started) return this.materials.pause();
    const lifetime = this.lifetime();
    // timeInMs 是绝对时间，需要先相对parent求相对时间 sceneTime
    const sceneTime = (timeInMs / 1000) - this.parent.startTime;
    if (sceneTime < lifetime.start || sceneTime >= lifetime.end) {
      return this.materials.pause();
    }

    // currentTime是当前素材的时间
    this.currentTime = sceneTime - lifetime.start;
    const matDuration = this.materials.getDuration();
    while (this.loop && this.currentTime >= matDuration) {
      this.currentTime = Math.max(0.0, this.currentTime - matDuration);
    }

    //todo: support speed

    // console.log('video drawing', {id:this.id, timeInMs, nextDeltaInMS, tt: this.currentTime, matDuration, pst: this.parent.startTime});
    const texture = this.materials.getFrameByTime(this.currentTime);
    // no need to update front-end render, canvas->texture binded when preProcessing
    if (this.backendRender) {
      this.display.updateBaseTexture(await texture, this.useCache);
    }

    if (nextDeltaInMS) {
      const nextTime = this.currentTime + (nextDeltaInMS / 1000);
      this.materials.prepare(nextTime >= matDuration ? 0.0 : nextTime);
    } else {
      this.materials.pause();
    }

    // for timelineUpdate callback await
    return texture;
  }

  /**
   * draw the first cover image
   * @private
   */
  drawCoverImage() {
    // todo: maybe should remove...
    const { display } = this;
    const [width, height] = this.getWH();
    const frame = this.materials.getSourceRect(width, height);
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

  destroy() {
    TimelineUpdate.removeFrameCallback(this.drawing);
    this.materials.destroy();
    this.fontendRender = null;
    super.destroy();
  }
}

module.exports = FFVideo;
