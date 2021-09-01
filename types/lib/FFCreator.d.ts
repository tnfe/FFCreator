/// <reference path="FFCon.d.ts" />
/// <reference path="Conf.d.ts" />
/// <reference path="FFBase.d.ts" />
/// <reference path="FFVtuber.d.ts" />

declare namespace FFCreatorSpace {
  interface FFCreatorConf extends ConfOptions {
    /**
     * 配置种类
     * @default creator
     */
    type?: ConfType;
  }

  interface FFCreatorEventMap {
    progress: FFCreatorProgressEvent;
    complete: FFCreatorCompleteEvent;
    start: FFCreatorStartEvent;
    error: FFCreatorErrorEvent;
  }

  type FFCreatorStartEvent = {
    type: 'start';
  };

  type FFCreatorProgressEvent = {
    type: 'progress';
    percent: number;
  };

  type FFCreatorCompleteEvent = {
    type: 'complete';
    output: string;
    useage: string;
  };

  type FFCreatorErrorEvent = {
    type: 'error';
    pos: unknown;
    error: string;
  };
  class FFCreator extends FFCon {
    constructor(conf: FFCreatorConf);

    on<K extends keyof FFCreatorEventMap>(name: K, fn: (ev: FFCreatorEventMap[K]) => any);

    /**
     *  Create output path, only used when using FFCreatorCenter.
     */
    generateOutput(): void;

    /**
     *  Get FFmpeg command line.
     */
    getFFmpeg(): void;

    /**
     * Set the fps of the composite video.
     * @param fps
     */
    setFps(fps: number): void;

    /**
     * Set the total duration of the composite video.
     * @param duration
     */
    setDuration(duration: number): void;

    /**
     *  Set configuration.
     * @param  key - the config key
     * @param  val - the config val
     * @param key
     * @param val
     */
    setConf(key: string, val: any): void;

    /**
     * Get configuration
     * @param key
     */
    getConf(key: string): any;

    addAudio(args: FFAudioConf): void;

    addVtuber(vtuber: FFVtuber): void;

    setSize(width: number, height: number): void;

    /**
     * Set the video output path
     * @param output - the video output path
     */
    setOutput(output: string): void;

    /**
     * Get the video output path
     */
    getFile(): string;

    /**
     * Set the video output path
     * @param  output - the video output path
     */
    output(output: string): void;

    closeLog(): void;

    openLog(): void;

    /**
     * Hook handler function
     * @todo 补全options类型
     * @param options
     */
    setInputOptions(options: Record<string, unknown>): void;

    start(): Promise<unknown>;

    static setFFmpegPath(path: string): void;

    static setFFprobePath(path: string): void;

    /**
     * Create new effect and add to effects object
     * @param name the new effect name
     * @param effectConf the new effect value
     */
    createEffect(name: string, effectConf: FFAnimationConf): void;
  }
}