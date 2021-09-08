declare namespace FFCreatorSpace {
  interface FFVideoAlbumConf extends FFNodeCommonConf {
    list: string[];
    ss?: number | string;
    /**
     * string example hh:mm:ss
     */
    to?: number | string;
    width?: number;
    height?: number;
  }
  /**
   * FFVideoAlbum - A Videos Album component that supports multiple switching animation effects
   *
   * @example
   *
   *     const album = new FFVideoAlbum({
   *        list: [v01, v01, v01, v01],
   *        x: 100,
   *        y: 100,
   *        width: 500,
   *        height: 300
   *    });
   *
   *
   */
  class FFVideoAlbum extends FFVideo {
    constructor(conf: FFVideoAlbumConf);

    /**
     * Get the path to get the Image
     * @return {string} img path
     */
    getPath(): string;

    /**
     * Material preprocessing
     * @return {Promise}
     */
    preProcessing(): Promise<unknown>;
  }
}
