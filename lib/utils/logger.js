'use strict';

/**
 * FFLogger - Simple, pretty and unified management logger for FFCreator
 *
 * ####Example:
 *
 *     FFLogger.info({ msg: "hello info" });
 *     FFLogger.error("This component must enter the width!");
 *
 * @object
 */
const colors = require('colors');
const Utils = require('./utils');

const PRE = '[FF]';
const FFLogger = {
  /**
   * Whether to open the print switch
   */
  enable: false,
  hooks: {},

  /**
   * Print information to the command line
   * @public
   */
  info(info) {
    info = typeof info === 'object' ? info : { msg: info };
    let { pos, msg = '' } = info;
    pos = pos ? `${pos} ` : '';

    const str = `${PRE} ${pos}${msg}`;
    this.enable && console.log(colors.green(str));
    this.hooks['info'] && this.hooks['info'](str);
  },

  /**
   * Print information to the command line
   * @public
   */
  log(info) {
    info = typeof info === 'object' ? info : { msg: info };
    let { pos, msg = '' } = info;
    pos = pos ? `${pos} ` : '';

    const str = `${PRE} ${pos}${msg}`;
    this.enable && console.log(colors.blue(str));
    this.hooks['log'] && this.hooks['log'](str);
  },

  /**
   * Print error message to the command line
   * @public
   */
  error(info) {
    info = typeof info === 'object' ? info : { error: info };
    let { pos, error = '', msg = '' } = info;
    pos = pos ? `${pos} ` : '';
    error = Utils.getErrStack(error);

    const str = `${PRE} ${pos}${msg}${error}`;
    console.error(colors.red(str));
    this.hooks['error'] && this.hooks['error'](str);
  },

  /**
   * Add callback hook
   * @public
   */
  addCallback(type, callback) {
    this.hooks[type] = callback;
  },
};

module.exports = FFLogger;
