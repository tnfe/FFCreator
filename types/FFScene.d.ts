declare namespace FFCreatorSpace {
  class FFScene extends FFCon {
    constructor();
    /**
     * Set background color
     * @param color  '#000000'
     */
    setBgColor(color: string): void;

    setDuration(num: number): void;

    addAudio(args: FFAudioConf): void;
  }
}
