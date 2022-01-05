'use strict';

/**
 * FFVideo - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideo({ path, width: 500, height: 350 });
 *     video.setAudio(true);
 *     scene.addChild(video);
 *
 * @class
 */

const FFGifImage = require('./gif');
const FFAudio = require('../audio/audio');
const VideoMaterial = require('../material/video');
const { isBrowser } = require('browser-or-node');

class FFVideo extends FFGifImage {
  constructor(conf) {
    super({ type: 'video', ...conf });
    this.preload = false;
    this.useCache = false;
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
   * Whether to play sound
   * @param {boolean} audio - Whether to play sound
   * @public
   */
  setAudio(audio = true) {
    this.material.useAudio = audio;
  }

  grantPlay() {
    return this.material.grantPlay(); // for safari
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    await super.preProcessing();
    if (isBrowser) return;
    const dir = this.rootConf('detailedCacheDir');
    const audioPath = await this.material.extract(dir, this.id);
    if (audioPath) {
      // todo: fade out...
      this.parent.addAudio(new FFAudio({
        path: audioPath,
        start: this.getDelayTime(),
        loop: this.loop,
        volume: this.volume,
      }));
    }
  }

  /**
   * Pause rendering by scene over
   * @private
   */
  end() {
    if (isBrowser && this.material) {
      this.material.pause();
      const lifetime = this.lifetime();
      const currentTime = this.creator()?.tweenGroup.now() / 1000;
      if (currentTime < this.parent.startTime + lifetime.start) {
        this.material.jumpTo(currentTime - this.parent.startTime - lifetime.start);
      }
    }
  }

  async drawing(timeInMs, nextDeltaInMS) {
    let texture = await super.drawing(timeInMs, nextDeltaInMS);
    if (!texture) this.material.pause();
  }
}

module.exports = FFVideo;
