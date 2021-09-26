'use strict';

/**
 * FS - File processing auxiliary functions
 *
 * ####Example:
 *
 *     const data = FS.readFileSync({ dir, name });
 *     await FS.writeFileAsync({ dir, name, buffer });
 *
 * @object
 */
const rmfr = require('rmfr');
const path = require('path');
const fs = require('fs-extra');
const leftPad = require('left-pad');

const FS = {
  format: 'raw',

  /**
   * Ensures that the directory exists. If the directory structure does not exist, it is created.
   * @public
   */
  ensureDir(dir, format = false) {
    if (format) dir = path.dirname(dir);
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
    this.format = format === 'raw' ? format : 'ff';
  },

  /**
   * Move files from one place to another
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.from - Original file name
   * @param {string} conf.to - Target file name
   * @async
   * @public
   */
  async moveFile({ dir, from, to }) {
    const fromFilePath = this.getFilePath({ dir, name: from, prefix: false });
    const toFilePath = this.getFilePath({ dir, name: to, prefix: true });
    await fs.move(fromFilePath, toFilePath, { overwrite: true });
  },

  /**
   * Write files synchronously
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {string} conf.buffer - Original file name
   * @public
   */
  writeFileSync({ dir, name, data }) {
    const filePath = this.getFilePath({ dir, name, prefix: true });
    fs.writeFileSync(filePath, data);
  },

  /**
   * The FS.readFileSync method is an inbuilt application programming interface
   * of fs module which is used to read the file and return its content.
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @return {buffer} This method returns the content of the file.
   * @public
   */
  readFileSync({ dir, name }) {
    const filePath = this.getFilePath({ dir, name, prefix: false });
    return fs.readFileSync(filePath);
  },

  /**
   * Write files asynchronously
   * @param {object} conf - processing configuration
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {string} conf.buffer - Original file name
   * @async
   * @public
   */
  async writeFileAsync({ dir, name, buffer }) {
    const filePath = this.getFilePath({ dir, name, prefix: false });
    const data = await fs.outputFile(filePath, buffer);
    return data;
  },

  /**
   * Get file extensions with JavaScript
   * @param {string} filename - input file
   * @return {string} - the file extensions
   * @public
   */
  getExt(filename) {
    return /[^.]+$/.exec(filename);
  },

  getFilePath({ dir, name, prefix = false }) {
    if (prefix) {
      return path.join(dir, `${leftPad(name, 12, '0')}.${this.format}`);
    } else {
      return path.join(dir, `${name}.${this.format}`);
    }
  },

  getCacheFilePath(dir) {
    return path.join(dir, `%012d.${this.format}`);
  },

  /**
   * Check if it is a font file
   * @param {string} font - input file
   * @public
   */
  isFont(font) {
    return /.*\.(ttf|otf|svg|woff|woff2|eot)$/gi.test(font);
  },
};

module.exports = FS;
