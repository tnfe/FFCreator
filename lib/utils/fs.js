'use strict';

/**
 * FS - File processing auxiliary functions
 *
 * ####Example:
 *
 *     const data = FS.readFileSync({ dir, name, nofix: true });
 *     await FS.writeFileAsync({ dir, name, buffer, nofix: true });
 *
 * @object
 */
const util = require('util');
const rmfr = require('rmfr');
const path = require('path');
const fs = require('fs-extra');
const leftPad = require('left-pad');
const getPixels = require('get-pixels');

const getPixelsFunc = util.promisify(getPixels);
let currFormat = 'raw';

const FS = {
  /**
   * Ensures that the directory exists. If the directory structure does not exist, it is created.
   * @public
   */
  ensureDir(dir) {
    fs.ensureDir(dir);
  },

  /**
   * removal of files and directories
   * @async
   * @public
   */
  async rmDir(dir) {
    await rmfr(dir);
  },

  setCacheFormat(format) {
    currFormat = format;
  },

  /**
   * Move files from one place to another
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.from - Original file name
   * @param {string} conf.to - Target file name
   * @param {boolean} conf.nofix - Whether to fill in the file prefix
   * @async
   * @public
   */
  async moveFile({dir, from, to, nofix = false}) {
    const fromFilePath = this.getRealFilePath({dir, name: from, nofix});
    const toFilePath = this.getPrefixFilePath({dir, name: to});

    await fs.move(fromFilePath, toFilePath, {overwrite: true});
  },

  /**
   * Write files synchronously
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {string} conf.buffer - Original file name
   * @public
   */
  writeFileSync({dir, name, data}) {
    const filePath = this.getPrefixFilePath({dir, name});
    fs.writeFileSync(filePath, data);
  },

  /**
   * The FS.readFileSync method is an inbuilt application programming interface
   * of fs module which is used to read the file and return its content.
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {boolean} conf.nofix - Whether to fill in the file prefix
   * @return {buffer} This method returns the content of the file.
   * @public
   */
  readFileSync({dir, name, nofix = false}) {
    const filePath = this.getRealFilePath({dir, name, nofix});
    return fs.readFileSync(filePath);
  },

  /**
   * The FS.getPixelsAsync method is an inbuilt application programming interface
   * of fs module which is used to read the file and return its content.
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {boolean} conf.nofix - Whether to fill in the file prefix
   * @return {buffer} This method returns the content of the file.
   * @public
   */
  async getPixelsAsync({type, dir, name, nofix = false}) {
    const filePath = this.getRealFilePath({dir, name, nofix});
    return await getPixelsFunc(filePath, `image/${type}`);
  },

  /**
   * Write files asynchronously
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {string} conf.buffer - Original file name
   * @param {boolean} conf.nofix - Whether to fill in the file prefix
   * @async
   * @public
   */
  async writeFileAsync({dir, name, buffer, nofix = false}) {
    const filePath = this.getRealFilePath({dir, name, nofix});
    const data = await fs.outputFile(filePath, buffer);
    return data;
  },

  getRealFilePath({dir, name, nofix = false}) {
    return nofix ? this.getNormalFilePath({dir, name}) : this.getPrefixFilePath({dir, name});
  },

  getPrefixFilePath({dir, name}) {
    const fileName = `${leftPad(name, 12, '0')}.${currFormat}`;
    return path.join(dir, fileName);
  },

  getNormalFilePath({dir, name}) {
    return path.join(dir, `${name}.${currFormat}`);
  },

  getCacheFilePath(dir) {
    return path.join(dir, `%012d.${currFormat}`);
  },
};

module.exports = FS;
