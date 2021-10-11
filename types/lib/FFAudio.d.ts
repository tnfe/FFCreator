declare namespace FFCreatorSpace {
  interface FFAudioConfProps {
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
    /**
     * string example hh:mm:ss
     */
    ss?: number | string;
    /**
     * string example hh:mm:ss
     */
    to?: number | string;
    start?: number;
    /**
     * same start
     */
    startTime?: number;
  }

  type FFAudioConf = FFAudioConfProps| string;

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
