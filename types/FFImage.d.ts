declare namespace FFCreatorSpace {

	interface FFImageConf extends Omit<FFNodeConf, 'type'> {
		path: string;
		resetPos?: boolean;
		resetXY?: boolean;
		// @todo 补充动画
		effect?: FFEffectConf;
		animate?: FFAnimationConf;
	}

	class FFImage extends FFNode {
		constructor(conf: FFImageConf);
	}
}
