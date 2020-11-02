'use strict';

/**
 * FS - File processing auxiliary functions
 *
 * ####Example:
 *
 *     const data = FS.readFileSync({ dir, name, nofix: true });
 *     await FS.writeAsync({ dir, name, buffer, nofix: true });
 *
 * @object
 */
const rmfr = require('rmfr');
const path = require('path');
const fs = require('fs-extra');
const leftPad = require('left-pad');

const FORMAT = 'raw';
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
    const fromFilePath = nofix
      ? this.getNormalFilePath({dir, name: from})
      : this.getPrefixFilePath({dir, name: from});
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
  writeSync({dir, name, buffer}) {
    const filePath = this.getPrefixFilePath({dir, name});
    fs.writeFileSync(filePath, buffer);
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
    const filePath = nofix
      ? this.getNormalFilePath({dir, name})
      : this.getPrefixFilePath({dir, name});
    return fs.readFileSync(filePath);
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
  async writeAsync({dir, name, buffer, nofix = false}) {
    const filePath = nofix
      ? this.getNormalFilePath({dir, name})
      : this.getPrefixFilePath({dir, name});
    const data = await fs.outputFile(filePath, buffer);
    return data;
  },

  /**
   * Read pixels from webgl to file
   * @param {object} conf - processing configuration
   * @param {GL} conf.gl - webgl object
   * @param {string} conf.dir - File directory
   * @param {string} conf.name - File directory
   * @param {number} conf.width - pixels width
   * @param {number} conf.height - pixels height
   * @async
   * @public
   */
  async writeByGLAsync({gl, dir, name, width, height}) {
    if (!this.byteArray) this.byteArray = new Uint8Array(width * height * 4);

    const filePath = this.getPrefixFilePath({dir, name});
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, this.byteArray);
    fs.writeFileSync(filePath, this.byteArray);
  },

  getPrefixFilePath({dir, name}) {
    const fileName = `${leftPad(name, 12, '0')}.${FORMAT}`;
    return path.join(dir, fileName);
  },

  getNormalFilePath({dir, name}) {
    return path.join(dir, `${name}.${FORMAT}`);
  },

  getCacheFilePath(dir) {
    return path.join(dir, `%012d.${FORMAT}`);
  },
};

module.exports = FS;
