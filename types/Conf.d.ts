declare namespace FFCreatorSpace {
	interface ConfOptions {
		/**
		 * @default 20
		 */
		crf?: number;
		/**
		 * @default null
		 */
		vb?: null;
		/**
		 * @default false
		 */
		pool?: boolean;
		/**
		 * 是否开启debug
		 * @default false
		 */
		debug?: boolean;
		/**
		 * 音乐循环
		 * @default false
		 */
		audioLoop?: boolean;
		/**
		 * @default false
		 */
		ffmpeglog?: boolean;
		/**
		 * @default medium
		 */
		preset?: string;
		/**
		 * @default raw
		 */
		cacheFormat?: string;
		/**
		 * @default 80
		 */
		cacheQuality?: number;
		/**
		 * @default true
		 */
		defaultOutputOptions?: boolean;
		/**
		 * @default 24
		 */
		fps?: number;
		/**
		 * @default 800
		 */
		width?: number | string;
		/**
		 * @default 800
		 */
		w?: number | string;
		/**
		 * @default 450
		 */
		height?: number | string;
		/**
		 * @default 450
		 */
		h?: number | string;
		/**
		 * @default 60
		 */
		rfps?: number;
		/**
		 * @default 60
		 */
		renderFps?: number;
		/**
		 * @default 当前根目录
		 */
		outputDir?: string;
		/**
		 * @default 当前根目录
		 */
		dir?: string;
		/**
		 * @default 当前根目录
		 */
		cacheDir?: string;
		/**
		 * @default `${this.conf.pathId}.mp4`
		 */
		output?: string;
		/**
		 * 输出的文件名
		 * @default `${this.conf.pathId}.mp4`
		 */
		out?: string;
		/**
		 * @default 5
		 */
		parallel?: number;
		/**
		 * @default 5
		 */
		frames?: number;
		/**
		 * @default 1mb
		 */
		highWaterMark?: string;
		/**
		 * @default 1mb
		 */
		size?: string;
	}

	/**
	 * Conf - A encapsulated configuration class is used to better manage configuration related
	 *
	 * @example
	 *
	 *     const conf = new Conf(conf);
	 *     const val = conf.getVal(key);
	 *     conf.setVal(key, val);
	 */
	class Conf {
		conf: ConfOptions;
		constructor(conf?: ConfOptions);

		/**
		 * Get the val corresponding to the key
		 * @param key
		 */
		getVal(key: string): any;

		/**
		 * Set the val corresponding to the key
		 * @param key
		 * @param value
		 */
		setVal(key: string, value: any): void;

		/**
		 * Get the width and height in the configuration (add separator)
		 * @param dot - separator default x
		 *
		 */
		getWH(dot: string): string;

		/**
		 * Get the cache directory
		 */
		getCacheDir(): string;
	}
}
