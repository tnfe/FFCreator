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

    /**
     * set transition
     * @param name
     * @param duration
     * @param params
     * @todo name type
     */
    setTransition(name: string, duration: number, params?: Record<string, any>): void;
  }
}
