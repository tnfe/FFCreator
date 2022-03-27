declare namespace FFCreatorSpace {
  interface FFTransitionConf {
    name: string;
    duration?: number;
  }

  /**
   *  FFTransition - transition between scenes
   *
   * @example
   *
   * const transition = new FFTransition({ name, duration });
   *
   */
  class FFTransition extends FFClip {
    constructor(conf: FFTransitionConf);
  }
}
