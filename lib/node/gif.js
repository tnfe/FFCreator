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
    super.preProcessing();
    // todo: share code with video
    const fps = this.rootConf('fps');
    await this.material.init({ fps });
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
    this.drawFirstFrame();
  }

  /**
   * draw the first image
   * @private
   */
  drawFirstFrame() {
    // const url = this.materials.getFrame(0);
    // const texture = this.getAsset(url);
    // this.draw({ texture });
    // this.setDisplaySize();
  }

  /**
   * Functions for drawing images
   * @private
   */
  drawing(timeInMs, nextDeltaInMS) {
    if (!super.drawing(timeInMs, nextDeltaInMS)) return false;
    console.log('gif.drawing', timeInMs);
    //todo: jump to time
    // const texture = this.materials.getFrame(this.frameIndex);
    // this.display.updateBaseTexture(texture, true);
    // this.nextFrame();
    return true;
  }

  /**
   * draw the next frame
   * @private
   */
  nextFrame() {
    const { fps } = this;
    const { length } = this.materials;
    const ra = this.rootConf('fps') / fps;
    this.index++;

    if (this.index >= ra) {
      this.index = 0;
      this.frameIndex++;
      if (this.loop && this.frameIndex >= length) {
        this.frameIndex = 0;
      }
    }
  }

  destroy() {
    this.material.destroy();
    super.destroy();
  }
}

module.exports = FFGifImage;
