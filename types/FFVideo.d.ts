declare namespace FFCreatorSpace {

	interface FFVideoConf extends FFImageConf {
		width: number | string;
	}

	class FFVideo extends FFImage {
		constructor(conf: FFVideoConf);

		/**
		 * Set start/end time
		 * @param startTime
		 * @param endTime
		 */
		setTimes(startTime: number, endTime: number): void;
	}
}
