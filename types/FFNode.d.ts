declare namespace FFCreatorSpace {
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
	}

	class FFAnimation {}

	class FFAnimations {}

	/**
	 * FFNode Class - FFCreator displays the basic class of the object,
	 * Other display objects need to inherit from this class.
	 *
	 * @example
	 *
	 *     const node = new FFNode({ x: 10, y: 20 });
	 */
	class FFNode extends FFBase {
		index: number;
		offsetX: number;
		offsetY: number;
		duration: number;
		anchor: number;
		animations: FFAnimation;

		constructor(conf: FFNodeConf);

		/**
		 * Set display object registration center
		 */
		setAnchor(anchor: number): void;

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
		 * set offsetx offsetY 偏移量  影响最终x y
		 * @param offsetX
		 * @param offSetY
		 */
		setOffset(offsetX: number, offSetY: number): void;

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
		addEffect(type: string, time: number, delay: number): void;

		/**
		 * All resources materials and actions are ready
		 */
		isReady(): Promise<unknown>;

		/**
		 * Material preprocessing
		 */
		preProcessing(): Promise<unknown>;

		start(): void;
	}
}



