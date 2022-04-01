'use strict';

/**
 * Renderer - Core classes for rendering animations and videos.
 *
 * ####Example:
 *
 *     const renderer = new Renderer({ creator: this });
 *     renderer.on("progress", progressHandler);
 *     renderer.on("render-start", startHandler);
 *     renderer.on("render-error", errorHandler);
 *
 *
 * ####Note:
 *     Rendering process
 *     1. Render the InkPaint scene and save the data to frames
 *     2. Save frame file and add transition animation
 *     3. Use ffmpeg to synthesize video files
 *     4. Delete cache folder
 *
 * @class
 */

// const GLReset = require("gl-reset");

const { nodeRequire, awaitMap } = require('../utils/utils');
const FS = nodeRequire('../utils/fs');
const Perf = nodeRequire('../utils/perf');
const Synthesis = nodeRequire('../core/synthesis');
const FFStream = nodeRequire('../utils/stream');

const { gl } = require('../../inkpaint/lib/index');
const forEach = require('lodash/forEach');
const GLUtil = require('../utils/gl');
const FFLogger = require('../utils/logger');
const CanvasUtil = require('../utils/canvas');
const Timeline = require('../timeline/timeline');
const FFBase = require('../core/base');
const { isBrowser } = require("browser-or-node");
const Material = require('../material/material');

class Renderer extends FFBase {
  constructor({ creator }) {
    super({ type: 'renderer' });
    this.stop = false;
    this.parent = creator;
    this.tweenGroup = creator.tweenGroup;
    this.mPLAYER = null;
  }

  async jumpTo(timeInMs) {
    const playRate = this.playRate;
    this.emit({ type: 'seeking', time: timeInMs });
    this.pause();
    await this.timeline.jumpTo(timeInMs);
    this.renderFrame();
    const currentTime = this.tweenGroup.now();
    this.emit({ type: 'seeked', currentTime });
    this.emit({ type: 'timeupdate', currentTime });
    if (playRate > 0) this.play(playRate);
  }

  async play(playRate=1.0) {
    this.playRate = playRate;
    if (this.playing) return;
    if (!this.played) {
      this.emit({ type: 'play' });
      this.played = true;
      // init play: grants full access to the video - safari
      const nodes = this.getCreator().allNodes;
      await awaitMap(nodes, node => node.grantPlay && node.grantPlay());
    }
    this.resetTimer();
    this.emit({ type: 'playing', currentTime: this._tweenr });
    this.playing = true;
    const ticker = 40;
    let aa = 0;
    const render = async () => {
      const creator = this.getCreator();
      if (!creator) return; // may destroy
      let adjust = this.mainDelay();
      const err = adjust;
      if (err !== 0) {
        aa += adjust;
        adjust = ((adjust * 0.2) + (aa * 0.01)) >> 0; // P=0.2, I=0.01, D=0.0
        adjust = Math.min(ticker, adjust); // max value: no more than ticker
      }
      let currentTime = this.tweenGroup.now();
      this.renderFrame();
      if (currentTime > this.timeline.duration * 1000) {
        currentTime = this.timeline.duration * 1000;
        this.pause(); // at end
      }
      this.emit({ type: 'timeupdate', currentTime });
      if (this.playRate > 0) { // play
        // console.log('time', Math.max(ticker + adjust, 1), Math.max(1, ticker - adjust) * playRate);
        // todo: wait or not ???
        await this.timeline.nextFrame(Math.max(1, ticker - adjust) * playRate);
        window.requestAnimationFrame(render);
        // setTimeout(render, Math.max(ticker + adjust, 1));
      } else { // pause
        this.playing = false;
        if (currentTime >= this.timeline.duration * 1000) {
          this.emit({ type: 'ended' });
        } else {
          this.emit({ type: 'pause', currentTime });
        }
      }
    }
    render();
  }

  async pause() {
    this.playRate = 0;
  }

  /**
   * Start rendering
   * @async
   * @public
   */
  async start() {
    if (!isBrowser) Perf.start();
    // console.log('start!!!');

    /**
     * preProcessing:
     *    node.preProcessing:   init display & probe material length
     *    node.annotate:        annotate start/end/duration
     * createTimeline:
     *    timeline.annotate:    calc the duration of spine and set to creator
     *    node.annotate(again): annotate start/end/duration since it may depend to creator duration
     * prepareMaterial:
     *    prepareMaterial:      extract video/audio for burning, since it depends on duration.
     *    initDraw:             init texture & draw the first frame
     * createSynthesis:
     *    start to burn
     */

    this.emit({ type: 'start' });
    try {
      await this.preProcessing();
    } catch (error) {
      if (isBrowser) {
        this.emit({ type: 'error', error });
        throw error; //todo: 先这样，避免浏览器卡死
      } else {
        this.emitError({ error, pos: 'preProcessing' });
      }
    }

    this.createTimeline();
    try {
      await this.prepareMaterial();
    } catch (error) {
      if (isBrowser) {
        this.emit({ type: 'error', error });
        throw error; //todo: 先这样，避免浏览器卡死
      } else {
        this.emitError({ error, pos: 'prepareMaterial' });
      }
    }

    if (!isBrowser) {
      this.configCache();
      this.createStream();
      this.createSynthesis(); // start burning here!
    }

    const creator = this.getCreator();
    const conf = this.rootConf();
    this.emit({ 
      type: 'loadedmetadata', 
      duration: creator.duration,
      width: conf.getVal('width'),
      height: conf.getVal('height'),
    });

    this.playRate = 0;
    this.renderFrame(); // render cover
    this.emit({ type: 'canplay' });
    creator.canplay = true;
  }

  /**
   * Confirm that there must be a cache folder
   * @private
   */
  configCache() {
    const conf = this.rootConf();
    const type = conf.getVal('cacheFormat');
    const dir = conf.getVal('detailedCacheDir');
    FS.ensureDir(dir);
    FS.setCacheFormat(type);
  }

  resetTimer() {
    this._timer = Date.now();
    this._tweenr = this.tweenGroup.now();
  }

  mainDelay() {
    const creator = this.getCreator();
    if (!this.mPLAYER || !Material.playing(this.mPLAYER.player())) {
      this.mPLAYER = this.player(creator.mVIDEOS);
      if (this.mPLAYER) this.resetTimer();
    }
    return this.mPLAYER ? (this.mPLAYER.delay() * 1000) >> 0 : this.timerDelay();
  }

  timerDelay() {
    const deltaTime = Date.now() - this._timer;
    const deltaTween = this.tweenGroup.now() - this._tweenr;
    // console.log({deltaTime, deltaTween});
    return deltaTween - deltaTime;
  }

  player(players) {
    for (let i = 0; i < players.length; i++) {
      if (Material.playing(players[i].player())) return players[i];
    }
  }

  /**
   * Init & probe materials in advance
   * @private
   */
  async preProcessing() {
    const creator = this.getCreator();

    const nodes = creator.allNodes;
    // sub child preProcessing, todo: 后端并发的跑会不会卡死？
    let loaded = 0, total = nodes.length;
    this.emit({ type: 'preloading', loaded, total, id: 'creator' });
    await awaitMap(nodes, async (node) => {
      let i = 0;
      while (true) {
        try {
          await node.preProcessing();
          loaded += 1;
          break;
        } catch (e) {
          if (++i > (node.retry || 1)) {
            throw `preprocess ${node.type}[id=${node.id}] fail, tried ${i}:\n`
                   + JSON.stringify(node.conf) + "\n" + JSON.stringify(e);
          }
          // console.error(`preprocess error: ${node.id}\n`, e);
        } finally {
          this.emit({ type: 'preloading', loaded, total, id: node.id });
        }
      }
    });

    // creator.removeAllDisplayChildren();

    // annotate time, 需要重新拿一遍allNodes, 因为video可能会addChild(audio)
    creator.allNodes.map(node => node.annotate());
  }

  /**
   * Prepare processing materials in advance
   * @private
   */
  async prepareMaterial() {
    const creator = this.getCreator();
    const nodes = creator.allNodes;
    // sub child preProcessing, todo: 后端并发的跑会不会卡死？
    await awaitMap(nodes, async (node) => {
      await node.prepareMaterial();
    });
  }

  /**
   * Create a stream pipeline for data transmission
   * @private
   */
  createStream() {
    const conf = this.rootConf();
    const size = conf.getVal('highWaterMark');
    const parallel = conf.getVal('parallel');

    const stream = new FFStream({ size, parallel });
    stream.addPullFunc(this.nodeRenderFrame.bind(this));
    stream.on('error', error => this.emitError({ error, pos: 'FFStream' }));
    this.stream = stream;
  }

  /**
   * Create a timeline to manage animation
   * @private
   */
  createTimeline() {
    this.timeline = new Timeline(this.getCreator());
    this.timeline.annotate();
  }

  async nodeRenderFrame() {
    const res = await this.renderFrame();
    await this.timeline.nextFrame();
    return res;
  }

  /**
   * Render a single frame, They are normal clips and transition animation clips.
   * @private
   */
  async renderFrame() {
    // player暂停状态下，等渲染好了再做后面的截图
    if (isBrowser && this.playRate <= 0) await this.timeline.pause();
    // console.log(`renderFrame at time: ${this.getCreator().timer}`);
    return this.snapshotToBuffer();
  }

  /**
   * Take a screenshot of node-canvas and convert it to buffer.
   * @private
   */
  snapshotToBuffer() {
    const conf = this.rootConf();
    const creator = this.getCreator();
    creator.render();

    if (isBrowser) return;
    const cacheFormat = conf.getVal('cacheFormat');
    const quality = conf.getVal('cacheQuality');
    const canvas = creator.app.view;
    const buffer = CanvasUtil.toBuffer({ type: cacheFormat, canvas, quality });
    return buffer;
  }

  /**
   * synthesis Video Function
   * @private
   */
  async createSynthesis() {
    const { stream, timeline } = this;

    const conf = this.rootConf();
    // const cover = conf.getVal('cover');
    const creator = this.getCreator();
    const audios = creator.allNodes.filter(x => x.type === 'audio');
    const synthesis = new Synthesis(conf);
    synthesis.setFramesNum(timeline.framesNum);
    synthesis.setDuration(timeline.duration);
    synthesis.addStream(stream);
    synthesis.addAudios(audios);
    // synthesis.addCover(cover);

    // add synthesis event
    this.bubble(synthesis);
    synthesis.on('synthesis-complete', event => {
      Perf.end();
      const useage = Perf.getInfo();
      event = { ...event, useage };
      this.emit('complete', event);
    });

    // await to update the first frame
    await creator.timeUpdate(0);
    synthesis.start();
    this.synthesis = synthesis;
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
   * Get parent creator
   * @private
   */
  getCreator() {
    return this.parent;
  }

  /**
   * Delete the cache intermediate folder
   * @private
   */
  removeCacheFiles() {
    // canvas: browser render has no cache
    if (this.rootConf('debug') || isBrowser) return;
    const dir = this.rootConf('detailedCacheDir');
    FS.rmDir(dir);
  }

  destroy() {
    this.stream && this.stream.destroy();
    this.timeline && this.timeline.destroy();
    this.synthesis && this.synthesis.destroy();
    this.removeCacheFiles();
    this.removeAllListeners();
    super.destroy();

    this.stop = true;
    this.parent = null;
    this.stream = null;
    this.timeline = null;
    this.synthesis = null;
    this.mPLAYER = null;
  }
}

module.exports = Renderer;
