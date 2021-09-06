declare namespace FFCreatorSpace {
  interface FFAlbumConf extends Omit<FFImageConf, 'path'> {
    list: string[];
    width: number;
    height?: number;
    showCover?: boolean;
  }

  /**
   * FFAlbum - A picture album component that supports multiple switching animation effects
   *
   * @example
   *
   *     const album = new FFAlbum({
   *        list: [a01, a02, a03, a04],
   *        x: 100,
   *        y: 100,
   *        width: 500,
   *        height: 300
   *    });
   *
   *
   */
  class FFAlbum extends FFImage {
    constructor(conf: FFAlbumConf);

    /**
     * Set total album animation duration
     * @param duration album animation duration @default 2
     */
    setDuration(duration: number): void;

    /**
     * Set the transition time of each image
     * @param time transition time @default 1
     */
    setTransTime(time: number): void;

    /**
     * Set the way to switch the album animation
     * @param transition  transition typev @default 'random'
     */
    setTransition(transition: 'random' | EffectTypes): void;

    getTotalDuration(): number;
  }
}
