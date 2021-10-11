declare namespace FFCreatorSpace {
  interface FFVideoConf extends FFImageConf {
    width: number;
    ss?: string | number;
    to?: string | number;
  }

  /**
   * FFVideo - Video component-based display component
   *  @example:
   *
   *     const video = new FFVideo({ path, width: 500, height: 350 });
   *     video.setAudio(true);
   *     video.setTimes("00:00:43", "00:00:50");
   *     scene.addChild(video);
   *
   *
   * @see
   *     https://spritejs.org/demo/#/video
   */
  class FFVideo extends FFImage {
    constructor(conf: FFVideoConf);

    /**
     * whether to play sound
     * @param isAudio
     * @default true
     */
    setAudio(isAudio: boolean): void;

    /**
     * Whether to loop the video
     * @param isLoop
     */
    setLoop(isLoop: boolean): void;

    /**
     * Set start time
     * @param startTime
     */
    setStartTime(startTime: number | string): void;

    /**
     * Set end time
     * @param endTime
     */
    setEndTime(endTime: number | string): void;

    /**
     * Set video codec
     * @param codec
     */
    setCodec(codec: 'libx264' | 'libvpx-vp9' | string): void;
  }
}
