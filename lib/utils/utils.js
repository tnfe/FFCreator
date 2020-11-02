'use strict';

/**
 * Utils - Utility function collection
 *
 * ####Example:
 *
 *     const effect = Utils.mergeExclude(effect, conf, ["type"]);
 *     const id = Utils.generateID(this.type);
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
  generateID(type) {
    if (cache[type] === undefined) cache[type] = 1;
    return type + '_' + String(cache[type]++);
  },

  /**
   * Generate 24-bit random number
   * @return {string} uid adsfUsdfn2
   * @public
   */
  uid() {
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
   * Format pixels buffer data and convert to base64
   * @param {buffer} pixels - pixels buffer
   * @return {string} result base64 string value
   * @public
   */
  bufferFormat({pixels, width}) {
    let t = 'data:image/png;base64,';
    let i, z, l;
    for (z = pixels.length - width * 4; z >= 0; z -= width * 4) {
      l = z + width * 4;

      for (i = z; i < l; i += 4) {
        t += pixels[i] + ' ' + pixels[i + 1] + ' ' + pixels[i + 2] + ' ';
      }
    }

    return t;
  },

  cloneNode(target) {
    const attr = target.attributes;
    const node = {
      x: attr.x,
      y: attr.y,
      opacity: attr.opacity,
      rotate: attr.rotate,
      scale: attr.scale[0],
    };

    return node;
  },

  copyNode(a, b) {
    for (let key in b) {
      if (key != 'sclale') a[key] = b[key];
    }
  },

  getErrStack(error) {
    error = typeof error === 'string' ? {message: error} : error;
    error = error.message || error.stack || error;
    return error;
  },
};

module.exports = Utils;
