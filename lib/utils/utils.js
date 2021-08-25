'use strict';

/**
 * Utils - Utility function collection
 *
 * ####Example:
 *
 *     const effect = Utils.mergeExclude(effect, conf, ["type"]);
 *     const id = Utils.genId(this.type);
 *
 * @object
 */
const cache = {};

const Utils = {
  /**
   * Generate auto-increment id based on type
   * @param {string} type - type
   * @return {string} id xxxx_10
   * @public
   */
  genId(type) {
    if (cache[type] === undefined) cache[type] = 1;
    return type + '_' + String(cache[type]++);
  },

  /**
   * Generate 24-bit random number
   * @return {string} uid adsfUsdfn2
   * @public
   */
  genUuid() {
    return (
      Math.random()
        .toString(36)
        .substr(-8) +
      Math.random()
        .toString(36)
        .substr(-8)
    );
  },

  /**
   * Delete an element of the array
   * @param {array} arr - target array
   * @param {any} elem - an element
   * @return {array} Original array
   * @public
   */
  deleteArrayElement(arr, elem) {
    const index = arr.indexOf(elem);
    if (index > -1) arr.splice(index, 1);
    return arr;
  },

  /**
   * Swap two elements of an array
   * @param {array} arr - target array
   * @param {any} elem1 - an element
   * @param {any} elem1 - other element
   * @return {array} Original array
   * @public
   */
  swapArrayElement(arr, elem1, elem2) {
    const index1 = typeof elem1 === 'number' ? elem1 : arr.indexOf(elem1);
    const index2 = typeof elem2 === 'number' ? elem2 : arr.indexOf(elem2);
    const temp = arr[index1];

    arr[index1] = arr[index2];
    arr[index2] = temp;
    return arr;
  },

  /**
   * Determine whether an array is a 2-latitude array
   * @param {array} arr - target array
   * @return {boolean} is a 2-latitude array
   * @public
   */
  isArray2D(arr) {
    if (!arr || !arr.length) return false;
    return Array.isArray(arr[0]);
  },

  /**
   * Remove undefined empty elements
   * @param {object} obj - target object
   * @return {object} target object
   * @public
   */
  deleteUndefined(obj) {
    for (let key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }

    return obj;
  },

  /**
   * Destroy the elements in object
   * @param {object} obj - target object
   * @public
   */
  destroyObj(obj) {
    if (typeof obj !== 'object') return;
    for (let key in obj) {
      delete obj[key];
    }
  },

  /**
   * Merge one object into another object (not including the key to be removed)
   * @param {object} obj1 - target object
   * @param {object} obj2 - source object
   * @return {object} result object
   * @public
   */
  mergeExclude(obj1, obj2 = {}, exclude = []) {
    for (let key in obj2) {
      if (exclude.indexOf(key) < 0 && obj2[key] !== undefined) obj1[key] = obj2[key];
    }
    return obj1;
  },

  insertSubArray(arr, index, itemArr) {
    if (!itemArr) return;

    arr.splice(index, 1);
    for (let i = 0; i < itemArr.length; i++) {
      arr.splice(index, 0, itemArr[0]);
    }
  },

  /**
   * Calculate the even number of the input value
   * @param {object} num - input value
   * @return {object} result value
   * @public
   */
  courtship(num) {
    num = num >> 0;
    return num % 2 === 0 ? num : num - 1;
  },

  floor(n, s = 2) {
    const k = Math.pow(10, s);
    return Math.floor(n * k) / k;
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Fix wrong file directory path // -> /
   * @param {string} path - file directory path
   * @public
   */
  fixFolderPath(path) {
    return path.replace(/\/\//gi, '/');
  },

  /**
   * toHash - Convert string to hash code
   * @param {string} str - Input string
   * @return {string} result hash string
   * @public
   */
  toHash(str) {
    let hash = 0,
      i,
      chr;

    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return hash + '';
  },

  getErrStack(error = {}) {
    error = typeof error === 'string' ? { message: error } : error;
    error = error.message || error.stack || error;
    return error;
  },

  storage: {},
};

module.exports = Utils;
