declare namespace FFCreatorSpace {
  interface FFAudioConf {
    path: string;
    /**
     * same path
     */
    src?: string;
    /**
     * @default false
     */
    bg?: boolean;
    /**
     * @default false
     */
    loop?: boolean;
    volume?: number;
    fadeIn?: number;
    fadeOut?: number;
    ss?: number;
    to?: number;
    start?: number;
    /**
     * same start
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
