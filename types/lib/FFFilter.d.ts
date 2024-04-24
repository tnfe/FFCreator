declare namespace FFCreatorSpace {
  interface FFFilterConf extends FFNodeCommonConf {
    name: string;
    params?: Record<string, unknown>;
  }

  /**
   * FFFilter - Custom filter for FFScene.
   *  @example
   *
   *     const glitch = new FFFilter({ name: "Glitch" });
   *     scene.addChild(glitch);
   */
  class FFFilter extends FFNode {
    constructor(conf: FFFilterConf);
  }
}
