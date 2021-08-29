'use strict';

/**
 * FFVideoAlbum - A Videos Album component that supports multiple switching animation effects
 *
 * ####Example:
 *
 *     const album = new FFVideoAlbum({
 *        list: [v01, v01, v01, v01],
 *        x: 100,
 *        y: 100,
 *        width: 500,
 *        height: 300
 *    });
 *
 *
 * @class
 */
const path = require('path');
const FS = require('../utils/fs');
const FFVideo = require('./video');
const forEach = require('lodash/forEach');
const DateUtil = require('../utils/date');
const FFmpegUtil = require('../utils/ffmpeg');

class FFVideoAlbum extends FFVideo {
  constructor(conf = { list: [] }) {
    super({ type: 'videoalbum', ...conf });

    this.list = conf.list || [];
    this.ccommand = FFmpegUtil.createCommand();
  }

  /**
   * Reset time of duration
   * @private
   */
  setDurationTime() {
    const { ss, to } = this.conf;
    if (ss && to) {
      let duration = 0;
      forEach(this.list, () => {
        const start = DateUtil.hmsToSeconds(ss);
        const end = DateUtil.hmsToSeconds(to);
        duration += end - start;
      });

      this.setDuration(0, duration);
    }
  }

  /**
   * Get the path to get the Image
   * @return {string} img path
   * @public
   */
  getPath() {
    const dir = this.rootConf('detailedCacheDir');
    return path.join(dir, `${this.id}_combine.mp4`);
  }

  /**
   * Material preprocessing
   * @return {Promise}
   * @public
   */
  async preProcessing() {
    const dir = this.rootConf('detailedCacheDir');
    FS.ensureDir(dir);

    this.setDurationTime();
    await this.combineVideos();
    await super.preProcessing();
  }

  /**
   * Combine multiple videos into one
   * @private
   */
  combineVideos() {
    const { ccommand } = this;

    return new Promise((resolve, reject) => {
      const dir = this.rootConf('detailedCacheDir');
      forEach(this.list, video => {
        const { ss, to } = this.conf;
        ccommand.input(video);
        if (ss && to) {
          ccommand.addInputOption('-ss', ss);
          ccommand.addInputOption('-to', to);
        }
      });
      ccommand.on('start', commandLine => console.log(commandLine));
      ccommand.on('end', () => resolve());
      ccommand.on('error', (error, stdout, stderr) => reject([error, stdout, stderr]));
      ccommand.mergeToFile(this.getPath(), dir);
    });
  }

  destroy() {
    const { list = [] } = this.conf;
    list.length = 0;
    this.list = null;
    FFmpegUtil.destroy(this.ccommand);
    super.destroy();
  }
}

module.exports = FFVideoAlbum;
