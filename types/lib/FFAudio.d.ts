declare namespace FFCreatorSpace {
  interface FFAudioConf extends FFBaseConf {
    src: string;
    path?: string;
    loop?: boolean;
    start?: number;
    volume?: number;
    /**
     * 与start 一样
     */
    startTime?: number;
  }

  /**
   *  FFAudio - audio component-can be used to play sound
   *
   * @example
   *
   *     const audio = new FFAudio(args);
   *
   * @see
   *     Adding multiple audio inputs to video with ffmpeg not working?
   *     https://superuser.com/questions/1191642/adding-multiple-audio-inputs-to-video-with-ffmpeg-not-working
   */
  class FFAudio extends FFBase {
    constructor(conf: FFAudioConf);
  }
}
