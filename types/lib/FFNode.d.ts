declare namespace FFCreatorSpace {
  /** common extends props */
  type FFNodeCommonConf = Pick<FFNodeConf, 'x' | 'y' | 'scale' | 'rotate' | 'opacity' | 'duration'>;

  interface FFNodeConf extends FFBaseConf {
    /**
     * 配置种类
     * @default node
     */
    type?: ConfType;
    /**
     * @default 0
     */
    x?: number;
    /**
     * @default 0
     */
    y?: number;
    /**
     * @default 1
     */
    scale?: number;
    /**
     * @default 0
     */
    rotate?: number;
    /**
     * @default 1
     */
    opacity?: number;
    /**
     * @default 0
     */
    duration?: number;
    /**
     * @default false
     */
    preload?: boolean;
  }

  /**
   * from the link
   * https://github.com/drawcall/inkpaint/blob/master/src/const.js
   * @todo support toUpperCase()
   */
  type AblendTypes =
    | 'NORMAL'
    | 'ADD'
    | 'MULTIPLY'
    | 'SCREEN'
    | 'OVERLAY'
    | 'DARKEN'
    | 'LIGHTEN'
    | 'COLOR_DODGE'
    | 'COLOR_BURN'
    | 'HARD_LIGHT'
    | 'SOFT_LIGHT'
    | 'DIFFERENCE'
    | 'EXCLUSION:'
    | 'HUE'
    | 'SATURATION'
    | 'COLOR'
    | 'LUMINOSITY'
    | 'NORMAL_NPM'
    | 'ADD_NPM'
    | 'SCREEN_NPM';

  class FFAnimation {}

  class FFAnimations {}

  /**
   * FFNode Class - FFCreator displays the basic class of the obj
   * Other display objects need to inherit from this class.
   *
   * @example
   *
   *     const node = new FFNode({ x: 10, y: 20 });
   */
  class FFNode extends FFBase {
    index: number;
    duration: number;
    anchor: number;
    animations: FFAnimation;

    constructor(conf: FFNodeConf);

    /**
     * Set display object registration center
     */
    setAnchor(anchorX: number, anchorY?: number): void;

    /**
     * Set display object scale
     * @param scale 1
     */
    setScale(scale: number): void;

    /**
     * Set display object rotate
     * @param rotate  0
     */
    setRotate(rotate: number): void;

    /**
     * Set the duration of node in the scene
     * @param duration 1
     */
    setDuration(duration: number): void;

    /**
     * Set display object x,y position
     * @param x 0
     * @param y 0
     */
    setXY(x: number, y: number): void;

    /**
     * Set display object opacity
     * @param opacity
     */
    setOpacity(opacity: number): void;

    /**
     * Set display object width and height
     * @param width
     * @param height
     */
    setWH(width: number, height: number): void;

    /**
     * Set display object width and height
     * @param width
     * @param height
     */
    setSize(width: number, height: number): void;

    /**
     * Get display object x,y position
     */
    getXY(): number[];

    /**
     * getX
     */
    getX(): number;

    /**
     * Get display object y position
     */
    getY(): number;

    /**
     * Get display object width and height
     */
    getWH(): number[];

    /**
     * get any props
     * @param key
     */
    getProp(key: string): any;

    /**
     * Add one/multiple animations or effects
     * @param animations
     */
    setAnimations(animations: FFAnimations): void;

    /**
     * Add special animation effects
     * @param type - animation effects name
     * @param time - time of animation
     * @param delay - delay of animation
     */
    addEffect(name: EffectTypes, time: number, delay: number): void;

    addEffect(name: EffectTypes[], time: number, delay: number): void;
    addEffect(conf: { type: EffectTypes; time: number; delay?: number }): void;

    /**
     * Add a FFAnimate animation
     * @param animation
     */
    addAnimate(animation: FFAnimation | FFAnimationConf): void;

    /**
     * All resources materials and actions are ready
     */
    isReady(): Promise<unknown>;

    /**
     * Material preprocessing
     */
    preProcessing(): Promise<unknown>;

    /**
     * Start rendering
     */
    start(): void;

    addBlend(blend: AblendTypes): void;
  }
}
