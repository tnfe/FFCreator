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
    this.genId();
  }

  /**
   * Generate self-increasing unique id
   * @return {string} unique id
   * @public
   */
  genId() {
    const { type } = this.conf;
    this.id = Utils.genId(type);
  }

  /**
   * Get the logical root node of the instance
   * @return {FFBase} root node
   * @public
   */
  root() {
    if (this.parent) return this.parent.root();
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
