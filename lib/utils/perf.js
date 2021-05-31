'use strict';

/**
 * Perf - Simple management performance statistics. Used to count cpu and memory usage.
 *
 * ####Example:
 *
 *     Perf.start();
 *     ...
 *     Perf.end();
 *
 * @object
 */
const os = require('os');
const FFLogger = require('./logger');

const Perf = {
  old: 0,
  now: 0,
  id: 0,
  t: 0,
  stats1: null,
  stats2: null,

  /**
   * Statistics start
   * @public
   */
  start() {
    this.old = Date.now();
    this.stats1 = this.getCpuInfo();
  },

  /**
   * Statistics end
   * @public
   */
  end() {
    this.now = Date.now();
    this.t = this.now - this.old;
    if (FFLogger.enable) this.analysis();
    this.old = Date.now();
  },

  analysis() {
    console.log('------------------------------------------------------');
    console.log('Perf', this.id++, this.t, this.getMemoryUsage(), this.getCpuUsage());
    console.log('------------------------------------------------------');
  },

  getCpuUsage() {
    this.stats2 = this.getCpuInfo();
    const startIdle = this.stats1.idle;
    const startTotal = this.stats1.total;
    const endIdle = this.stats2.idle;
    const endTotal = this.stats2.total;

    const idle = endIdle - startIdle;
    const total = endTotal - startTotal;
    const perc = idle / total;

    const useage = 1 - perc;
    return this.getPercent(useage, 1);
  },

  getInfo() {
    return `time ${this.t} memory ${this.getMemoryUsage()} cpu ${this.getCpuUsage()}`;
  },

  getMemoryUsage() {
    const useage = process.memoryUsage();
    const heapTotal = useage.heapTotal;
    const heapUsed = useage.heapUsed;
    const rss = useage.rss;
    const proportion = this.getPercent(heapUsed, heapTotal);
    return `${heapUsed} ${heapTotal} ${rss} ${proportion}`;
  },

  getCpuInfo() {
    const cpus = os.cpus();

    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;
    let total = 0;

    for (let cpu in cpus) {
      if (!Object.prototype.hasOwnProperty.call(cpus, cpu)) continue;
      user += cpus[cpu].times.user;
      nice += cpus[cpu].times.nice;
      sys += cpus[cpu].times.sys;
      irq += cpus[cpu].times.irq;
      idle += cpus[cpu].times.idle;
    }

    total = user + nice + sys + idle + irq;
    return { idle, total };
  },

  getPercent(a, b) {
    return Math.floor((a * 1000) / b) / 10 + '%';
  },
};

module.exports = Perf;
