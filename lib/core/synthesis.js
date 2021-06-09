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
const isEmpty = require('lodash/isEmpty');
const forEach = require('lodash/forEach');

const FS = require('../utils/fs');
const Utils = require('../utils/utils');
const DateUtil = require('../utils/date');
const FFLogger = require('../utils/logger');
const FFmpegUtil = require('../utils/ffmpeg');
const FFEventer = require('../event/eventer');

class Synthesis extends FFEventer {
  constructor(conf) {
    super();

    this.conf = conf;
    this.audios = null;
    this.framesNum = 100;
    this.inputOptions = [];
    this.outputOptions = [];
    const threads = conf.getVal('threads');
    this.command = FFmpegUtil.createCommand({ threads });
  }

  /**
   * Add the intermediate pictures processed in the cache directory to ffmpeg input
   * @param {Stream} stream - A readability stream
   * @public
   */
  addInput(stream) {
    const { conf, command } = this;
    const type = conf.getVal('cacheFormat');
    command.addInput(stream);
    if (type === 'raw') command.inputFormat('rawvideo');
  }

  /**
   * set total frames number
   * @param {number} framesNum - total frames number
   * @public
   */
  setFramesNum(framesNum) {
    const { conf } = this;
    const fps = conf.getVal('fps');
    const rfps = conf.getVal('rfps');
    this.framesNum = Math.ceil((framesNum * fps) / rfps);
  }

  /**
   * Add one or more background sounds
   * ##Note: Usage of adelay filter
   * [1]adelay=5000|5000[a];
   * [2]adelay=10000|10000[b];
   * [3]adelay=15000|15000[c];
   * [a][b][c]amix=3[a]
   * @param {array} audios - background sounds
   * @private
   */
  addAudioFilter() {
    const { audios } = this;
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
    const type = conf.getVal('cacheFormat');
    // raw (unencoded data in BGRA order on little-endian (most) systems, ARGB on big-endian systems; top-to-bottom)
    const size = conf.getWH('x');
    const opts =
      type === 'raw'
        ? ['-s', size, '-vcodec', 'rawvideo', '-pixel_format', 'bgra', '-video_size', size]
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
    const { conf, audios } = this;
    const defaultOutputOptions = conf.getVal('defaultOutputOptions');

    // custom
    const customOpts = conf.getVal('outputOptions');
    if (customOpts) FFmpegUtil.concatOpts(this.outputOptions, customOpts);

    // default
    const defaultOpts = this.getDefaultOutputOptions(conf);
    if (defaultOutputOptions) FFmpegUtil.concatOpts(this.outputOptions, defaultOpts);

    // music
    if (!isEmpty(audios)) {
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
  addAudios(audios) {
    this.audios = audios;
  }

  /**
   * Open ffmpeg production and processing
   * @public
   */
  start() {
    this.addInputOptions();
    this.addAudioFilter();
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
    const { conf, command, framesNum } = this;
    const output = conf.getVal('output');
    const ffmpeglog = conf.getVal('ffmpeglog');
    const highWaterMark = conf.getVal('highWaterMark');

    // start event
    command.on('start', commandLine => {
      FFmpegUtil.setHighWaterMark({ command, highWaterMark });
      this.emit({ type: 'synthesis-start', command: commandLine });
      if (ffmpeglog) {
        command.ffmpegProc.stderr.on('data', data => console.log(data));
      }
      // log info
      FFLogger.info({ pos: 'Synthesis', msg: `synthesis start: ${commandLine}` });
    });

    // progress event
    command.on('progress', progress => {
      let percent = Utils.floor(progress.frames / framesNum, 2);
      percent = Math.min(1, percent);
      this.emitProgress({ percent });
      // log info
      FFLogger.info({ pos: 'Synthesis', msg: `synthesis progress: ${percent * 100}% done.` });
    });

    // complete
    command.on('end', () => {
      this.emit({ type: 'synthesis-complete', output });
      FFLogger.info({ pos: 'Synthesis', msg: 'synthesis complete.' });
    });

    // error
    command.on('error', (error, stdout, stderr) => {
      this.emitError({ error, pos: 'Synthesis' });
      FFLogger.error({
        error,
        pos: 'Synthesis',
        msg: `stdout:${stdout} \n stderr:${stderr}`,
      });
    });
  }

  destroy() {
    super.destroy();
    FFmpegUtil.destroy(this.command);

    this.conf = null;
    this.audios = null;
    this.command = null;
    this.inputOptions.length = 0;
    this.outputOptions.length = 0;
  }
}

module.exports = Synthesis;
