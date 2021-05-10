'use strict';

/**
 * Synthesis - A class for video synthesis.
 * Mainly rely on the function of ffmpeg to synthesize video and audio.
 *
 * ####Example:
 *
 *     const synthesis = new Synthesis(conf);
 *     synthesis.start();
 *
 *
 * @class
 */
const path = require('path');
const EventEmitter = require('events');
const isEmpty = require('lodash/isEmpty');
const forEach = require('lodash/forEach');

const FS = require('../utils/fs');
const Utils = require('../utils/utils');
const DateUtil = require('../utils/date');
const FFLogger = require('../utils/logger');
const FFmpegUtil = require('../utils/ffmpeg');
const EventHelper = require('../event/helper');

class Synthesis extends EventEmitter {
  constructor(conf) {
    super();

    this.conf = conf;
    this.audios = null;
    this.inputOptions = [];
    this.outputOptions = [];

    this.eventHelper = new EventHelper(this);
    this.command = FFmpegUtil.createCommand();
  }

  /**
   * Add the intermediate pictures processed in the cache directory to ffmpeg input
   * @public
   */
  addInput() {
    const { conf } = this;
    const type = conf.getVal('cacheType');
    const dir = conf.getVal('detailedCacheDir');

    const files = FS.getCacheFilePath(dir);
    this.command.addInput(files);
    if (type !== 'raw') this.command.inputFormat('image2');
  }

  /**
   * Add one or more background sounds
   * ##Note: Usage of adelay filter
   * [1]adelay=5000|5000[a];
   * [2]adelay=10000|10000[b];
   * [3]adelay=15000|15000[c];
   * [a][b][c]amix=3[a]
   * @param {array} audios - background sounds
   * @public
   */
  addAudio(audios) {
    if (isEmpty(audios)) return;

    forEach(audios, audio => {
      this.command.addInput(audio.path);
      if (audio.loop) this.command.inputOptions(['-stream_loop', '-1']);
    });

    const audiosOpts = [];
    let outputs = ``;
    forEach(audios, (audio, index) => {
      const delay = DateUtil.toMilliseconds(audio.start);
      const input = `${1 + index}`;
      const output = `audio${index}`;
      audiosOpts.push(`[${input}]adelay=${delay}|${delay}[${output}]`);
      outputs += `[${output}]`;
    });

    // audiosOpts.push(`${outputs}amix=${audios.length}[audio]`);
    audiosOpts.push(`${outputs}amix=${audios.length}`);
    this.command.complexFilter(audiosOpts);
  }

  /**
   * Add ffmpeg input configuration
   * @private
   */
  addInputOptions() {
    const { conf } = this;
    const rfps = conf.getVal('rfps');
    FFmpegUtil.concatOpts(this.inputOptions, ['-framerate', rfps]);

    const customOpts = conf.getVal('inputOptions');
    if (customOpts) FFmpegUtil.concatOpts(this.inputOptions, customOpts);

    const defaultOpts = this.getDefaultInputOptions(conf);
    FFmpegUtil.concatOpts(this.inputOptions, defaultOpts);
    this.command.inputOptions(this.inputOptions);
  }

  /**
   * Get default ffmpeg input configuration
   * @private
   */
  getDefaultInputOptions() {
    const { conf } = this;
    const type = conf.getVal('cacheType');
    // raw (unencoded data in BGRA order on little-endian (most) systems, ARGB on big-endian systems; top-to-bottom)
    const opts =
      type === 'raw'
        ? ['-vcodec', 'rawvideo', '-pixel_format', 'bgra', '-video_size', conf.getWH('x')]
        : [];
    return opts;
  }

  /**
   * Get default ffmpeg output configuration
   * @private
   */
  getDefaultOutputOptions() {
    const { conf } = this;
    const vb = conf.getVal('vb');
    const fps = conf.getVal('fps');
    const crf = conf.getVal('crf');
    const preset = conf.getVal('preset');

    let opts = []
      // misc
      .concat([
        '-hide_banner', // hide_banner - parameter, you can display only meta information
        '-map_metadata',
        '-1',
        '-map_chapters',
        '-1',
      ])

      // video
      .concat([
        '-c:v',
        'libx264', // c:v - H.264
        '-profile:v',
        'main', // profile:v - main profile: mainstream image quality. Provide I / P / B frames
        '-preset',
        preset, // preset - compromised encoding speed
        '-crf',
        crf, // crf - The range of quantization ratio is 0 ~ 51, where 0 is lossless mode, 23 is the default value, 51 may be the worst
        '-movflags',
        'faststart',
        '-pix_fmt',
        'yuv420p',
        '-r',
        fps,
      ]);

    //---- vb -----
    if (vb) {
      opts = opts.concat(['-vb', vb]);
    }

    return opts;
  }

  /**
   * Add ffmpeg output configuration
   * @private
   */
  addOutputOptions() {
    const { conf } = this;
    const defaultOutputOptions = conf.getVal('defaultOutputOptions');

    // custom
    const customOpts = conf.getVal('outputOptions');
    if (customOpts) FFmpegUtil.concatOpts(this.outputOptions, customOpts);

    // default
    const defaultOpts = this.getDefaultOutputOptions(conf);
    if (defaultOutputOptions) FFmpegUtil.concatOpts(this.outputOptions, defaultOpts);

    // music
    if (!isEmpty(this.audios)) {
      FFmpegUtil.concatOpts(this.outputOptions, ['-c:a', 'aac', '-shortest']);
    }

    this.command.outputOptions(this.outputOptions);
  }

  /**
   * Set ffmpeg input path
   * @private
   */
  addOutput() {
    const { conf } = this;
    const output = conf.getVal('output');
    const dir = path.dirname(output);
    FS.ensureDir(dir);
    this.command.output(path.normalize(output));
  }

  /**
   * Set audios to ffmpeg
   * @public
   */
  setAudios(audios) {
    this.audios = audios;
  }

  /**
   * Open ffmpeg production and processing
   * @public
   */
  start() {
    const { audios } = this;
    this.addInput();
    this.addInputOptions();
    this.addAudio(audios);
    this.addOutputOptions();
    this.addCommandEvents();
    this.addOutput();
    this.command.run();
  }

  /**
   * Add FFmpeg event to command
   * @private
   */
  addCommandEvents() {
    const { conf, command } = this;
    const totalFrames = conf.getVal('totalFrames');

    // start
    command.on('start', commandLine => {
      this.eventHelper.emit({ type: 'start', command: commandLine });
      FFLogger.info({ pos: 'Synthesis', msg: `synthesis start: ${commandLine}` });
    });

    // progress
    command.on('progress', progress => {
      const percent = Utils.floor(100 * (progress.frames / totalFrames), 2);
      this.eventHelper.emitProgress({ type: 'progress', percent });
      FFLogger.info({ pos: 'Synthesis', msg: `synthesis progress: ${percent}% done` });
    });

    // complete
    command.on('end', () => {
      const output = conf.getVal('output');
      this.eventHelper.emit({ type: 'complete', output });
      FFLogger.info({ pos: 'Synthesis', msg: 'synthesis complete' });
    });

    // error
    command.on('error', (error, stdout, stderr) => {
      this.eventHelper.emitError({ type: 'error', error, pos: 'Synthesis' });
      FFLogger.error({
        error,
        pos: 'Synthesis',
        msg: `stdout:${stdout} \n stderr:${stderr}`,
      });
    });
  }

  destroy() {
    this.conf = null;
    this.audios = null;
    this.command = null;
    this.eventHelper.destroy();
    this.eventHelper = null;
    this.removeAllListeners();
  }
}

module.exports = Synthesis;
