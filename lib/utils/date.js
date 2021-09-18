'use strict';

/**
 * DateUtil - Auxiliary utils functions for date.
 *
 * ####Example:
 *
 *     const time1 = DateUtil.toMilliseconds(.5);
 *     const time2 = DateUtil.hmsToSeconds("00:03:21");
 *
 * @object
 */

const DateUtil = {
  /**
   * Convert seconds to hh:mm:ss format
   * @param {number} sec - second
   * @return {string} hh:mm:ss result
   * @public
   */
  secondsToHms(sec) {
    if (typeof sec === 'string') return sec;

    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return hours + ':' + minutes + ':' + seconds;
  },

  /**
   * Convert hh:mm:ss format time to seconds
   * @param {string} hms - hh:mm:ss format time
   * @return {number} seconds second
   * @public
   */
  hmsToSeconds(hms) {
    if (typeof hms === 'number') return hms;

    const a = hms.split(':');
    const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return seconds;
  },

  /**
   * Convert time to millisecond format
   * @param {number} time - second time
   * @return {string} millisecondt
   * @public
   */
  toMilliseconds(time) {
    if (time === 0) return 0;
    return time * 1000;
    //return time < 100 ? time * 1000 : time;
  },

  /**
   * Convert time to second format
   * @param {number} time - millisecondt time
   * @return {string} second
   * @public
   */
  toSeconds(time) {
    if (time === 0) return 0;
    return time > 100 ? time / 1000 : time;
  },
};

module.exports = DateUtil;
