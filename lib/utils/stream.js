'use strict';

/**
 * FFStream - A stream class that implements the pond-well-bucket mechanism
 *
 * ####Pond Well Bucket:
 *  1. The water in the well was scooped out bucket by bucket.
 *  2. In the end, the rest may be less than a bucket.
 *  3. If there is no water in the well, fill a well from the pond.
 *  4. Continue 1, 2, 3 until there is no water in the pond.
 *
 * ####Note:
 *  - If the bucket is too small, it will double the number of times to scoop water and waste manpower.
 *  - If the bucket is too large, there is a risk of load.
 *
 * ####Reference:
 *
 *  - https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/546
 *  - https://nodejs.org/es/docs/guides/backpressuring-in-streams/
 *
 * @class
 */

const siz = require('siz');
const Readable = require('stream').Readable;

class FFStream extends Readable {
  constructor({ size = 1024, parallel }) {
    super();

    this.size = siz(size);
    this.highWaterMark = this.size; // default is 64k
    this.parallel = parallel;
    this.data = null;
    this.pullFunc = null;
    this.cursor = 0;
    this.index = 0;
  }

  addPullFunc(func) {
    this.pullFunc = func;
  }

  async fillNewData() {
    let { parallel } = this;
    const buffs = [];

    for (let i = 0; i < parallel; i++) {
      const buff = await this.pullFunc();
      buff && buffs.push(buff);
    }

    return parallel === 1 ? buffs[0] : Buffer.concat(buffs);
  }

  async _read() {
    let { size } = this;

    if (!this.data) {
      try {
        this.data = await this.fillNewData();
      } catch (e) {
        console.error(e);
        //throw new Error(`Stream pull data-rendering framing error ${e}.`);
      }
    }

    if (this.isEmpty(this.data)) {
      this.push(null);
      return;
    }

    let end = size + this.cursor;
    if (end > this.data.length) {
      end = this.data.length;
      this.push(this.data.slice(this.cursor, end));
      this.cursor = 0;
      this.data = null;
    } else {
      this.push(this.data.slice(this.cursor, end));
      this.cursor = end;
    }
  }

  isEmpty(data) {
    if (!data) return true;
    return !data.length;
  }

  destroy() {
    super.destroy();
    this.unpipe();
    this.removeAllListeners();
    this.pullFunc = null;
    this.data = null;
  }
}

module.exports = FFStream;
