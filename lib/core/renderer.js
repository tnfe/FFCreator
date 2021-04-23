'use strict';

/**
 * Renderer - Core classes for rendering animations and videos.
 *
 * ####Example:
 *
 *     const renderer = new Renderer({ threads: 4, creator: this });
 *     renderer.on("progress", progressHandler);
 *     renderer.on("render-start", startHandler);
 *     renderer.on("render-error", errorHandler);
 *
 *
 * ####Note:
 *     Rendering process
 *     1. Render the spritejs scene and save the data to frames
 *     2. Save frame file and add transition animation
 *     3. Use ffmpeg to synthesize video files
 *     4. Delete cache folder
 *
 * @class
 */

// const GLReset = require("gl-reset");
const GL = require('gl');
const forEach = require('lodash/forEach');
const FS = require('../utils/fs');
const Perf = require('../utils/perf');
const FFBase = require('../core/base');
const Utils = require('../utils/utils');
const Synthesis = require('./synthesis');
const Frames = require('../utils/frames');
const FFLogger = require('../utils/logger');
const Timeline = require('../utils/timeline');
const EventHelper = require('../event/helper');
class Renderer extends FFBase {
  constructor({creator, threads = 4, delay = 5, useWorker = false}) {
    super({type: 'renderer'});

    this.cursor = 0;
    this.percent = 0;
    this.stop = false;
    this.delay = delay;
    this.parent = creator;
    this.threads = threads;
    this.currentScene = null;
    this.useWorker = useWorker;

    this.frames = new Frames();
    this.eventHelper = new EventHelper(this);
    this.eventHelper.setFreq(30);
  }

  /**
   * Start rendering
   * @async
   * @public
   */
  async start() {
    this.eventHelper.emit({type: 'render-start'});
    await this.preparedMaterials();

    Perf.start();
    this.createGL();
    this.transBindGL();
    this.ensureCacheDir();
    this.createSynthesis();
    this.renderNextScene();
  }

  /**
   * Confirm that there must be a cache folder
   * @private
   */
  ensureCacheDir() {
    const dir = this.rootConf('detailedCacheDir');
    FS.ensureDir(dir);
  }

  /**
   * Prepare processing materials in advance
   * @private
   */
  async preparedMaterials() {
    try {
      const creator = this.getCreator();
      await creator.preProcessing();
    } catch (error) {
      this.eventHelper.emitError({
        error,
        type: 'render-error',
        pos: 'preparedMaterials',
        errorType: 'preprocessing-error',
      });
    }
  }

  /**
   * Create webgl environment context
   * @private
   */
  createGL() {
    const width = this.rootConf('width');
    const height = this.rootConf('height');
    this.gl = GL(width, height);
  }

  /**
   * Binding gl context for each transition animation
   * @private
   */
  transBindGL() {
    forEach(this.getScenes(), scene => scene.transition.bindGL(this.gl));
  }

  /**
   * Create video composition class
   * @private
   */
  createSynthesis() {
    const conf = this.rootConf();
    this.synthesis = new Synthesis(conf);
  }

  /**
   * Get parent creator
   * @private
   */
  getCreator() {
    return this.parent;
  }

  /**
   * Line up to render the next scene
   * @private
   */
  async renderNextScene() {
    if (this.cursor >= this.getScenes().length) {
      this.renderTransAndSaveFiles();
    } else {
      // append and current scene start
      const creator = this.getCreator();
      this.currentScene = this.getScenes()[this.cursor];
      // wait scene isReady
      await this.currentScene.isReady();
      creator.addOnlyDisplayChild(this.currentScene);
      this.currentScene.start();

      // batch concurrent rendering
      for (let i = 0; i < this.threads; i++) {
        await Utils.sleep(i * 10);
        this.renderSceneSingleFrame();
      }
    }
  }

  /**
   * Render every frame in the scene
   * @private
   */
  async renderSceneSingleFrame() {
    if (this.stop) return;

    if (this.currentScene.frameIsEnd()) {
      await Utils.sleep(120);
      FFLogger.info({
        pos: 'renderSceneSingleFrame',
        msg: `current scene frames - ${this.currentScene.frames.total()}`,
      });

      this.currentScene.frames.testing();
      // end of rendering skip to the next scene
      // this.emit('scene-complete', this.cursor);
      this.cursor++;
      this.renderNextScene();
    } else if (this.currentScene.frameIsOver()) {
      // directly end doing nothing
    } else {
      try {
        // rendering next frame
        this.eventHelper.calAndEmitProgress({
          type: 'render-progress',
          state: 'render-frame',
          percent: (1 / this.getScenesTotalFrames()) * 0.7,
        });

        const cursor = this.currentScene.frameCursor;
        this.currentScene.nextFrame();
        await this.screenshot(cursor);
        await this.timelineNextFrame();
        await this.renderSceneSingleFrame();
      } catch (error) {
        this.eventHelper.emitError({
          error,
          type: 'render-error',
          pos: 'renderSceneSingleFrame',
          errorType: 'render-error',
        });
      }
    }
  }

  /**
   * Save screenshots of each frame
   * https://github.com/Automattic/node-canvas#canvastobuffer
   * raw (unencoded data in BGRA order on little-endian (most) systems,
   * ARGB on big-endian systems; top-to-bottom)
   * @private
   */
  async screenshot(cursor) {
    const creator = this.getCreator();
    const canvas = creator.display.snapshot();
    const buffer = canvas.toBuffer('raw');
    const dir = this.rootConf('detailedCacheDir');
    const name = `${this.currentScene.id}_${cursor}`;
    await FS.writeAsync({dir, name, buffer, nofix: true});
    this.currentScene.pushFrame(cursor, name);
  }

  /**
   * Render the next frame on the timeline
   * @private
   */
  async timelineNextFrame() {
    const rfps = this.rootConf('rfps');
    Timeline.update(rfps);
    await Utils.sleep(this.delay);
  }

  getScenesTotalFrames() {
    if (!this.scenesTotalFrames) {
      this.scenesTotalFrames = 0;
      forEach(this.getScenes(), scene => (this.scenesTotalFrames += scene.getFramesNum()));
    }
    return this.scenesTotalFrames;
  }

  /**
   * Render the transition animation and save the frame file
   * @private
   */
  async renderTransAndSaveFiles() {
    try {
      this.spliceNewFrames();
      await this.saveFramesFiles();
      await this.synthesisVideo();
    } catch (error) {
      this.eventHelper.emitError({
        error,
        type: 'render-error',
        pos: 'renderTransAndSaveFiles',
        errorType: 'synthesis-error',
      });
    }
  }

  /**
   * Split scene into sub-frame
   * new timeline frame stitching method
   *  |--------|===|
   *           |--------|===|
   *                    |-----------|
   * @private
   */
  spliceNewFrames() {
    this.frames.empty();
    let framesNum = 0;

    forEach(this.getScenes(), (scene, j) => {
      const sframes = scene.frames;
      sframes.frameStart = framesNum;
      sframes.transFramesNum = scene.getTransFramesNum(); // 600
      sframes.preTransFramesNum = Math.max(0, sframes.total() - sframes.transFramesNum); // 1400=2000-600

      const nextScene = this.getNextScene(scene);
      const nextSceneFrames = nextScene ? nextScene.frames : null;

      forEach(sframes.frames, (frame, i) => {
        const index = sframes.frameStart + Number(i);
        if (!this.frames.get(index)) {
          const current = sframes;
          const next = i < sframes.preTransFramesNum ? null : nextSceneFrames; // [0-1400] null <-> [1600-2000] next scene
          const frameObj = {current, next, cindex: j};
          this.frames.add(index, frameObj);
        }
      });

      framesNum += sframes.preTransFramesNum;
    });

    return this.frames;
  }

  /**
   * Save files of all frames
   * @private
   */
  async saveFramesFiles() {
    const totalFrames = this.frames.total();
    this.rootConf('totalFrames', totalFrames);

    for (let i = 0; i < totalFrames; i++) {
      if (this.stop) return;

      try {
        const frameObj = this.frames.get(i);
        await this.saveSingleFrameFile(frameObj, i);
        this.eventHelper.calAndEmitProgress({
          type: 'render-progress',
          state: 'save-frame',
          percent: (1 / totalFrames) * 0.2,
        });
      } catch (error) {
        this.eventHelper.emitError({
          error,
          type: 'render-error',
          pos: 'saveFramesFiles',
          errorType: 'synthesis-error',
        });
      }
    }
  }

  /**
   * Save Single frame file
   * @private
   */
  async saveSingleFrameFile(frameObj, i) {
    const name = i;
    const {gl} = this;
    const {current, next, cindex} = frameObj;
    const width = this.rootConf('width');
    const height = this.rootConf('height');
    const dir = this.rootConf('detailedCacheDir');

    const cframeIndex = i - current.frameStart;
    const from = current.get(cframeIndex);

    if (!next) {
      await FS.moveFile({dir, to: name, from, nofix: true});
    } else {
      const nframeIndex = i - next.frameStart;
      const to = next.get(nframeIndex);
      const progress = (cframeIndex - current.preTransFramesNum) / current.transFramesNum;

      const scene = this.getSceneByIndex(cindex);
      const trans = scene.transition;
      const dir = this.rootConf('detailedCacheDir');
      await trans.render({dir, from, to, progress});
      await FS.writeByGLAsync({gl, dir, name, width, height});
    }
  }

  /**
   * synthesis Video Function
   * @private
   */
  async synthesisVideo() {
    const creator = this.getCreator();
    const audios = creator.concatAudios();
    this.synthesis.setAudios(audios);

    // add synthesis event
    this.synthesis.on('start', this.eventHelper.bind('synthesis-start'));
    this.synthesis.on('error', this.eventHelper.bind('synthesis-error'));
    this.synthesis.on('complete', event => {
      // pref end
      Perf.end();
      event.useage = Perf.getInfo();

      this.eventHelper.calAndEmitProgress({
        type: 'render-progress',
        state: 'synthesis-video',
        percent: 1,
      });
      this.eventHelper.emit('all-complete', event);
    });

    this.synthesis.start();
  }

  getScenes() {
    const creator = this.getCreator();
    return creator.children;
  }

  /**
   * Get the scene through index
   * @private
   */
  getSceneByIndex(index) {
    const scenes = this.getScenes();
    return scenes[index];
  }

  /**
   * Get the next scene
   * @private
   */
  getNextScene(scene) {
    const scenes = this.getScenes();
    let index = scenes.indexOf(scene);
    index++;

    if (index >= scenes.length) return null;
    return scenes[index];
  }

  /**
   * Delete the cache intermediate folder
   * @private
   */
  removeCacheFiles() {
    if (this.rootConf('debug')) return;

    const dir = this.rootConf('detailedCacheDir');
    FS.rmDir(dir);
  }

  /**
   * Destroy the frame buffer
   * @private
   */
  destroyFrames() {
    for (let i = this.frames.length - 1; i >= 0; i--) {
      Utils.destroyObj(this.frames[i]);
      delete this.frames[i];
    }
    this.frames.length = 0;
  }

  destroy() {
    // GLReset(this.gl)();
    this.stop = true;
    this.removeCacheFiles();
    this.gl = null;
    this.parent = null;
    this.currentScene = null;

    this.destroyFrames();
    this.synthesis.destroy();
    this.eventHelper.destroy();
    this.removeAllListeners();
    this.eventHelper = null;

    super.destroy();
  }
}

module.exports = Renderer;
