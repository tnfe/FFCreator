declare namespace FFCreatorSpace {
  type PresetType =
    | 'ultrafast'
    | 'superfast'
    | 'veryfast'
    | 'faster'
    | 'fast'
    | 'medium'
    | 'slow'
    | 'slower'
    | 'veryslow';

  interface ConfOptions {
    /**
     * Constant Rate Factor for ffmpeg
     * @default 20
     */
    crf?: number;
    /**
     * bitrate set bitrate for ffmpeg
     * @default null
     */
    vb?: string;

    cover?: string;
    /**
     * @default false
     */
    pool?: boolean;
    /**
     * whether debug module
     * @default false
     */
    debug?: boolean;
    /**
     * @default true
     */
    preload?: boolean;
    /**
     * @default false
     */
    antialias?: boolean;
    /**
     * whether audio loop
     * @default false
     */
    audioLoop?: boolean;
    /**
     * whether print ffmpeglog
     * @default false
     */
    ffmpeglog?: boolean;
    /**
     * setting output QA
     * @default 'medium'
     */
    preset?: PresetType;
    /**
     * setting cache file type
     * @default 'raw'
     */
    cacheFormat?: string;
    /**
     * setting cache QA
     * @default 80
     */
    cacheQuality?: number;
    /**
     * @default 1
     */
    resolution?: number;
    /**
     * whether default output options
     * @default true
     */
    defaultOutputOptions?: {
      merge?: boolean;
      options: string[];
    } | null;
    /**
     * setting fps
     * @default 24
     */
    fps?: number;
    /**
     * setting video screen width
     * @default 800
     */
    width?: number | string;
    /**
     * setting video screen width
     * @default 800
     */
    w?: number | string;
    /**
     * setting video screen height
     * @default 450
     */
    height?: number | string;
    /**
     * setting video screen height
     * @default 450
     */
    h?: number | string;
    /**
     * render fps
     * @default 60
     */
    rfps?: number;
    /**
     * @default 60
     */
    renderFps?: number;
    /**
     * setting outputfile dir
     * @default current root
     */
    outputDir?: string;
    /**
     * setting outputfile dir
     * @default current root
     */
    dir?: string;
    /**
     * setting cachefile dir
     * @default current root
     */
    cacheDir?: string;
    /**
     * set output file name
     * @default `${this.conf.pathId}.mp4`
     */
    output?: string;
    /**
     * set output file name
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
    /**
     * @default medium
     */
    clarity?: string;
    /**
     * @default medium
     */
    renderClarity?: string;
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
