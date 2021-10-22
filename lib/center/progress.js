'use strict';

/**
 * Progress - A class used to calculate the production progress
 *
 *
 * @class
 */

class Progress {
  constructor(max = 60) {
    this.id = -1;
    this.ids = [];
    this.percent = 0;
    this.max = max;
  }

  add(id) {
    this.ids.push(id);
    if (this.ids.length > this.max) this.ids.shift();
  }

  getPercent(id) {
    if (this.id == id) {
      return this.percent;
    } else if (this.ids.indexOf(id) > -1) {
      return 1;
    } else {
      return 0;
    }
  }
}

module.exports = Progress;
