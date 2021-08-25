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
const path = require('path');
const FS = require('../utils/fs');
const FFImage = require('./image');
const { Sprite, Texture } = require('inkpaint');
const FFLogger = require('../utils/logger');
const FFmpegUtil = require('../utils/ffmpeg');
const Materials = require('../utils/materials');
const TimelineUpdate = require('../timeline/update');

class FFGifImage extends FFImage {
  constructor(conf = { list: [] }) {
    super({ type: 'gif', ...conf });

    this.loop = conf.loop === undefined ? true : conf.loop;
    this.frameIndex = 0;
    this.materials = new Materials();
    this.command = FFmpegUtil.createCommand();
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
   * GIF file extraction and framing
   * @private
   */
  extractGif() {
    return new Promise((resolve, reject) => {
      const fps = this.rootConf('fps');
      const ops = `-vsync cfr -r ${fps} -start_number 0`;
      const path = this.getPath();

      this.materials.path = this.getOutput();
      this.command.addInput(path);
      this.command.outputOptions(ops.split(' '));
      this.command.output(this.materials.path);
      this.command
        .on('start', commandLine => {
          FFLogger.info({ pos: 'FFGif', msg: `Gif preProcessing start: ${commandLine}` });
        })
        .on('progress', progress => {
          this.materials.length = progress.frames;
        })
        .on('end', () => {
          FFLogger.info({
            pos: 'FFGif',
            msg: `Gif preProcessing completed: ${this.materials}`,
          });
          resolve();
        })
        .on('error', error => {
          FFLogger.error({ pos: 'FFGif', msg: `Gif preProcessing error`, error });
          reject(error);
        });
      this.command.run();
    });
  }

  getOutput() {
    const dir = this.rootConf('detailedCacheDir');
    FS.ensureDir(dir);
    return path.join(dir, `${this.id}_%d.png`);
  }

  preProcessing() {
    return this.extractGif();
  }

  /**
   * Get the URL that needs to be preloaded
   * @public
   */
  getPreloadUrls() {
    const url = this.materials.getFrame(0);
    return [url];
  }

  /**
   * Start rendering
   * @public
   */
  start() {
    this.drawFirstFrame();
    this.animations.start();
    this.addTimelineCallback();
  }

  /**
   * draw the first image
   * @private
   */
  drawFirstFrame() {
    const url = this.materials.getFrame(0);
    const texture = this.getAsset(url);
    this.draw({ texture });
    this.setDisplaySize();
  }

  /**
   * Add Timeline callback hook
   * @private
   */
  addTimelineCallback() {
    this.animations.onAniStart(() => {
      this.drawing = this.drawing.bind(this);
      TimelineUpdate.addFrameCallback(this.drawing);
    });
  }

  /**
   * Functions for drawing images
   * @private
   */
  drawing() {
    const texture = this.materials.getFrame(this.frameIndex);
    this.display.updateBaseTexture(texture, true);
    this.nextFrame();
  }

  /**
   * draw the next frame
   * @private
   */
  nextFrame() {
    const { length } = this.materials;
    const ra = this.rootConf('rfps') / this.rootConf('fps');
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
    TimelineUpdate.removeFrameCallback(this.drawing);
    FFmpegUtil.destroy(this.command);
    this.materials.destroy();
    super.destroy();
  }
}

module.exports = FFGifImage;
