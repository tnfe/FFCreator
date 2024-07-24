'use strict';

/**
 * ffprobe - a Compatible FFmpeg Probe Method
 *
 * ####Example:
 *
 *
 *
 * @object
 */
const probe = require('ffmpeg-probe');
const ffmpeg = require('fluent-ffmpeg');

const useFluent = true;
const ffprobe = filePath => {
  if (useFluent) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          // console.log(metadata);
          resolve(metadata);
        }
      });
    });
  } else {
    return probe(filePath);
  }
};

module.exports = ffprobe;
