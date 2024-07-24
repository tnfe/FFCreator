// FFmpegUtil.d.ts

declare namespace FFCreatorSpace {
  interface FFmpegUtil {
    getFFmpeg(): any;

    setFFmpegPath(path: string): void;

    setFFprobePath(path: string): void;

    setFFPath(): void;

    createCommand(conf?: { threads?: number }): any;

    interceptVideo(options: { video: string; ss: string; to: string; output: string }): void;
    captureVideoFrame(options: { input: string; output: string; frame?: number }): Promise<string>;

    convertVideoToGif(options: {
      input: string;
      output: string;
      fps?: number;
      width?: number;
    }): Promise<string>;

    concatOpts(opts: any[], arr: any[] | any): void;

    destroy(command: any): void;
  }

  const FFmpegUtil: FFmpegUtil;
}
