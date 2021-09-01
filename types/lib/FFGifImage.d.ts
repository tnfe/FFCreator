declare namespace FFCreatorSpace {
  interface FFGifImageConf extends FFImageConf {}

  /**
   * FFGIfImage - A Component that supports gif animation
   *
   * @example
   *
   *     const path = path.join(__dirname, './sun.gif');
   *     const gif = new FFGIfImage({ path, x: 320, y: 520 });
   * @since v3.5.3
   */
  class FFGifImage extends FFImage {
    constructor(conf: FFGifImageConf);

    /**
     * Set whether to loop the animation
     * @param loop whether loop
     */
    setLoop(loop: boolean): void;
  }
}
