'use strict';

/**
 * FFBase - Basic classes in FFCreator. Note: Its subclass is not necessarily a display class.
 *
 * ####Example:
 *
 *     class FFCon extends FFBase
 *
 * @class
 */
const Conf = require('../conf/conf');
const Utils = require('../utils/utils');
const FFEventer = require('../event/eventer');

class FFBase extends FFEventer {
  constructor(conf) {
    super();

    this.conf = { type: 'base', ...conf };
    this.type = this.conf.type;
    this.parent = null;
    this.retry = 3;
    this.genId();
  }

  /**
   * Generate self-increasing unique id
   * @return {string} unique id
   * @public
   */
  genId() {
    const { type, id } = this.conf;
    this.id = id || Utils.genId(type);
  }

  /**
   * Get the logical root node of the instance
   * @return {FFBase} root node
   * @public
   */
  root() {
    if (this.parent && this.parent.root) return this.parent.root();
    else return this;
  }

  /**
   * Get the conf configuration on the logical root node of the instance
   * If the val parameter is set, the val value of conf is set
   * @param {string} key - configuration key
   * @param {any} val - configuration val
   * @return {object|any} root node
   * @public
   */
  rootConf(key, val) {
    let conf = Conf.getFakeConf();
    const root = this.root();
    if (root && root.type === 'creator') conf = root.conf;

    if (key) {
      if (val !== undefined) conf.setVal(key, val);
      return conf.getVal(key);
    } else {
      return conf;
    }
  }

  /**
   * Add callback hook
   * @param {function} callback - callback function
   * @public
   */
  addFrameCallback(callback) {
    this.creator()?.addFrameCallback(callback);
  }

  /**
   * Remove callback hook
   * @param {function} callback - callback function
   * @public
   */
  removeFrameCallback(callback) {
    this.creator()?.removeFrameCallback(callback);
  }

  creator() {
    const root = this.root();
    if (root.type === 'creator') return root;
  }

  /**
   * Destroy the component
   * @public
   */
  destroy() {
    super.destroy();
    this.conf = null;
    this.parent = null;
  }
}

module.exports = FFBase;
