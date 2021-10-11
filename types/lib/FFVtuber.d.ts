declare namespace FFCreatorSpace {
  interface FFVtuberConf {
    path: string;
    /**
     * @default video
     */
    mode?: 'video' | 'frame';
    x: number;
    y: number;
    width: number;
    height: number;
    start?: number;
    end?: number;
    /**
     * color rgb value min
     */
    min?: number;
    /**
     * same min
     */
    colormin?: number;
    /**
     * color rgb value max
     */
    max?: number;
    /**
     * same max
     */
    colormax?: number;
  }

  /**
   * FFVtuber - A simple virtual anchor component
   *
   * @example
   *
   *     const vtuber = new FFVtuber({ path, x: 320, y: 520, mode: 'video' });
   *     vtuber.setCutoutColor(90, 200);
   *
   */
  class FFVtuber extends FFVideo {
    constructor(conf: FFVtuberConf);

    /**
     * Turn on rgb cutout
     * @param min
     * @param max
     */
    setCutoutColor(min: number, max: number): void;

    setPath(path: string, start: number, end: number): void;
  }
}
