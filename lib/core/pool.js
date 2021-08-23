'use strict';

/**
 * Pool
 *
 * Object buffer pool - used to save memory overhead
 *
 * Examples:
 *
 *     const display = Pool.get("sprite", () => new Sprite());
 *
 * @public
 */

const Pool = {
  cache: {},

  get(type, func) {
    if (!this.cache[type] || !this.cache[type].length) return func();

    const node = this.cache[type].pop();
    return node;
  },

  put(type, instance) {
    if (!instance) return;
    if (!this.cache[type]) this.cache[type] = [];

    this.cache[type].push(instance);
  },

  resetNode(node) {
    if (node.removeAllChildren) node.removeAllChildren();
    return node;
  },

  toString() {
    let info = 'Pool: ';
    for (let key in this.cache) {
      const obj = this.cache[key];
      const l = obj ? obj.length : 0;
      info += `${key}-length:${l}  `;
    }

    return info;
  },
};

module.exports = Pool;
