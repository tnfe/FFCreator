declare namespace FFCreatorSpace {
  interface FFVtuberConf extends Omit<FFImageConf, 'resetPos' | 'resetXY' | 'effect' | 'animate'> {}

  /**
   * FFVtuber - A simple virtual anchor component
   *
   * @example
   *
   *     const vtuber = new FFVtuber({ x: 320, y: 520 });
   *     vtuber.setPath(vpath, 1, 7);    // 从第1-7.png
   *     vtuber.setSpeed(6);
   *
   */
  class FFVtuber extends FFImage {
    constructor(conf: FFVtuberConf);

    /**
     * Get a cloned object
     */
    clone(): FFVtuber;

    /**
     * Set up an animated sprite texture
     * @param texture
     * @param json
     */
    setTexturePacker(texture: string, json: string): void;

    /**
     * Set up an animated sprite texture
     * @param texture
     * @param json
     */
    setTexture(texture: string, json: string): void;

    /**
     * Set component playback speed
     * @param speed
     */
    setSpeed(speed: number): void;

    /**
     * Set animation schedule cycle
     * [[0, 3.2], [0, 5]]
     * @param period
     */
    setPeriod(period: number[]): void;

    /**
     * Get animation schedule cycle
     */
    getPeriod(): number[];
  }
}
