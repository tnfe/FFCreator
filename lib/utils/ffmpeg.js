'use strict';

/**
 * FFmpegUtil - Auxiliary utils functions related to ffmpeg
 *
 * ####Example:
 *
 *     FFmpegUtil.concatOpts(this.inputOptions, ["-framerate", rfps]);
 *
 * @object
 */
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

  createCommand(conf = {}) {
    const { threads = 1 } = conf;
    const command = ffmpeg();
    if (threads > 1) command.addOptions([`-threads ${threads}`]);
    return command;
  },

  concatOpts(opts, arr) {
    if (isArray(arr)) {
      forEach(arr, o => opts.push(o));
    } else {
      opts.push(arr);
    }
  },
};

module.exports = FFmpegUtil;
