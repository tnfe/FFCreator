declare namespace FFCreatorSpace {
	interface FFTextConf extends FFNodeConf {
		text?: string;
		/**
		 * 字号
		 * @default 36
		 */
		fontSize?: number;
		color?: string;
		backgroundColor?: string;
		/**
		 * 字体文件路径
		 */
		font?: string;
		/**
		 * 样式传入，目前支持的属性有限需要测试
		 */
		style?: Record<string, any>;
	}

	class FFText extends FFNode {
		constructor(conf: FFTextConf);

		setColor(color: string): void;

		setBackgroundColor(color: string): void;

		setText(text: string): void;
		/**
		 * @todo 测试补全
		 * @param style
		 */
		setStyle(style: any): void;
	}
}
