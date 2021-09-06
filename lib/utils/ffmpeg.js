'use strict';

/**
 * FFmpegUtil - Auxiliary utils functions related to ffmpeg
 *
 * ####Example:
 *
 *     FFmpegUtil.concatOpts(this.inputOptions, ["-framerate", fps]);
 *
 * @object
 */
const siz = require('siz');
const isArray = require('lodash/isArray');
const forEach = require('lodash/forEach');
const ffmpeg = require('fluent-ffmpeg');

const FFmpegUtil = {
  /**
   * Return fluent-ffmpeg class instance
   *
   * @return {ffmpeg} fluent-ffmpeg
   * @public
   */
  getFFmpeg() {
    return ffmpeg;
  },

  /**
   * Set the installation path of the current server ffmpeg.
   * If not set, the ffmpeg command of command will be found by default.
   *
   * @param {string} path - installation path of the current server ffmpeg
   * @public
   */
  setFFmpegPath(path) {
    ffmpeg.setFfmpegPath(path);
  },

  /**
   * Set the installation path of the current server ffprobe.
   * If not set, the ffprobe command of command will be found by default.
   *
   * @param {string} path - installation path of the current server ffprobe
   * @public
   */
  setFFprobePath(path) {
    ffmpeg.setFfprobePath(path);
  },

  /**
   * Set a water mark for swpan stdin
   *
   * @param {number} highWaterMark - a water mark for swpan stdin
   * @public
   */
  setHighWaterMark({ command, highWaterMark }) {
    highWaterMark = siz(highWaterMark);
    command.ffmpegProc.stdin._writableState.highWaterMark = highWaterMark;
    command.ffmpegProc.stdin._readableState.highWaterMark = highWaterMark;
  },

  /**
   * Create a ffmpeg command instance
   * @public
   */
  createCommand(conf = {}) {
    const { threads = 1 } = conf;
    const command = ffmpeg();
    if (threads > 1) command.addOptions([`-threads ${threads}`]);
    return command;
  },

  /**
   * Set a cover thumbnail for the video
   * @public
   */
  addCoverImage({ video, output, cover }) {
    return new Promise((resolve, reject) => {
      const command = this.createCommand();
      command.addInput(video);
      command.addInput(cover);
      command.output(output);
      command.outputOptions(
        '-map 0 -map 1 -c copy -c:v:1 png -disposition:v:1 attached_pic'.split(' '),
      );
      //command.on('start', commandLine => console.log(commandLine));
      command.on('end', () => {
        resolve();
        this.destroy(command);
      });
      command.on('error', (error, stdout, stderr) => {
        reject([error, stdout, stderr]);
        this.destroy(command);
      });
      command.run();
    });
  },

  /**
   * Take a Clip from the video
   * @public
   */
  interceptVideo({ video, ss, to, output }) {
    return new Promise((resolve, reject) => {
      const command = this.createCommand();
      command.addInput(video);
      command.addInputOption('-ss', ss);
      command.addInputOption('-to', to);
      command.output(output);
      command.outputOptions('-vcodec copy -acodec copy'.split(' '));

      //command.on('start', commandLine => console.log(commandLine));
      command.on('end', () => {
        resolve();
        this.destroy(command);
      });
      command.on('error', (error, stdout, stderr) => {
        reject([error, stdout, stderr]);
        this.destroy(command);
      });
      command.run();
    });
  },

  concatOpts(opts, arr) {
    if (isArray(arr)) {
      forEach(arr, o => opts.push(o));
    } else {
      opts.push(arr);
    }
  },

  destroy(command) {
    try {
      command.removeAllListeners();
      command.kill();
      command._inputs.length = 0;
      command._currentInput = null;
    } catch (e) {}
  },
};

module.exports = FFmpegUtil;
