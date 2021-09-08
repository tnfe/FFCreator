declare namespace FFCreatorSpace {
  interface FFImageConf extends FFNodeCommonConf {
    path: string;
    resetPos?: boolean;
    resetXY?: boolean;
    effect?: FFEffectConf;
    animate?: FFAnimationConf;
    alpha?: number;
    width?: number;
    height?: number;
  }

  /**
   * FFImage - Image component-based display component
   *  @example
   *
   *     const img = new FFImage({ path, x: 94, y: 271, width: 375, height: 200, resetXY: true });
   *     img.addEffect("slideInDown", 1.2, 0);
   *     scene.addChild(img);
   */
  class FFImage extends FFNode {
    constructor(conf: FFImageConf);

    /**
     * Get the path to get the Image
     */
    getPath(): void;

    /**
     * Set image style by object
     */
    setStyle(style: Record<string, any>): void;
  }
}
