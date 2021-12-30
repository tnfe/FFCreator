'use strict';

/**
 * OpenCVUtil - Utils functions related to opencv
 *
 * @object
 */

/**
 * Config opencv root if needed
 */
// const OPENCV_ROOT = process.env.OPENCV_ROOT || '/usr/local/Cellar/opencv/4.5.4_1';
// process.env.OPENCV_BIN_DIR = `${OPENCV_ROOT}/bin`;
// process.env.OPENCV_LIB_DIR = `${OPENCV_ROOT}/lib`;
// process.env.OPENCV_INCLUDE_DIR = `${OPENCV_ROOT}/include`;
// process.env.OPENCV4NODEJS_DISABLE_AUTOBUILD = 1;

const { ImageData } = require('canvas');
const { nodeRequire } = require('./utils');
const cv = nodeRequire('opencv4nodejs');

const OpenCVUtil = {
  VideoCapture(path) {
    return cv && new cv.VideoCapture(path);
  },

  getFrameByTime(vCap, time) {
    let currentIdx = vCap.get(cv.CAP_PROP_POS_FRAMES);
    const fps = vCap.get(cv.CAP_PROP_FPS);
    const idx = (time * fps) >> 0;
    if (idx >= currentIdx && idx - currentIdx <= 3) {
      // if (idx != currentIdx) console.log('step', idx - currentIdx);
      while (idx != currentIdx++) vCap.read(); // [0, N] forward read, faster than seek
    } else if (idx - currentIdx == -1) {
      return vCap.lastFrameData;
    } else {
      // console.log('seek', idx - currentIdx);
      vCap.set(cv.CAP_PROP_POS_FRAMES, idx); // seek is 5-10x slower than single read
    }

    let frame = vCap.read();
    if (frame.empty) return;
    // cvt cost 30-40% of read time, but inkpaint render need RGBA
    frame = frame.cvtColor(cv.COLOR_BGR2RGBA);
    const frameData = new ImageData(
      new Uint8ClampedArray(frame.getData()),
      frame.cols, frame.rows
    );
    frame.release(); // 加上release会快5-10%，疑似malloc内存复用
    vCap.lastFrameData = frameData;
    return frameData;
  },

  destroy(vCap) {
    vCap.lastFrameData = null;
    vCap.release();
  }
};

module.exports = OpenCVUtil;
