const sample = require('lodash/sample');
const find = require('lodash/find');

/**
 * @typedef {{
 *   name: string;
 *   paramsTypes: Record<string, unknown>;
 *   defaultParams: Record<string, unknown>;
 *   glsl: string;
 * }} ShaderConfig
 */

/** @type { ShaderConfig[] } */
const filters = [];

const FilterManager = {
  /**
   *
   * @param { string } name
   * @returns
   */
  getFilterByName(name) {
    return name.toLowerCase() === 'random'
      ? this.getRandomShader()
      : find(filters, filter => filter.name.toLowerCase() === name.toLowerCase());
  },

  getRandomShader() {
    return sample(filters);
  },

  /**
   * @param { ShaderConfig } filter
   * @returns
   */
  register(filter) {
    if (filters.find(temp => temp.name.toLowerCase() === filter.name.toLowerCase())) {
      throw new Error(`duplicated filter: ${filter.name}`);
    }
    filters.push(filter);
    return this;
  },
};

module.exports = {
  FilterManager,
};
