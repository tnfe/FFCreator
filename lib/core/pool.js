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
    this.resetNode(node);
    return node;
  },

  put(type, instance) {
    if (!instance) return;
    if (!this.cache[type]) this.cache[type] = [];

    this.resetNode(instance);
    this.cache[type].push(instance);
  },

  resetNode(node) {
    if (node.removeAllChildren) node.removeAllChildren();
    node.attr({ opacity: 1, x: 0, y: 0, scale: [1, 1], rotate: 0 });
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
