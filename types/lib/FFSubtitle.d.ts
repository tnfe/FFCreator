/// <reference path="FFNode.d.ts" />
declare namespace FFCreatorSpace {
  interface FFSubtitleConf {
    text?: string;
    comma?: boolean;
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    style?: Record<string, any>;
    x?: number;
    y?: number;
  }

  /**
   * * FFSubtitle - Subtitle component, can be used in conjunction with voice-to-subtitle tts
   *
   * @example
   *
   *     const text = "《街头霸王5》是卡普空使用虚幻引擎开发的3D格斗游戏.";
   *     const subtitle = new FFSubtitle({ x: 320, y: 520 });
   *     subtitle.setText(text);
   */
  class FFSubtitle extends FFNode {
    frameBuffer: number;

    constructor(conf: FFSubtitleConf);

    /**
     * Set frame buffer
     * @param buffer frame buffer
     */
    setFrameBuffer(buffer: number): void;

    /**
     * Set up voice narration
     * @param speech
     */
    setSpeech(speech: string): void;

    /**
     * Set up voice dialogue
     * @param audio
     */
    setAudio(audio: string): void;

    /**
     * Set Subtitle text
     * @param text
     */
    setText(text: string): void;

    /**
     * Set segmentation regular
     * @param reg
     */
    setRegexp(reg: RegExp): void;

    /**
     * Set text font size
     * @param size
     */
    setFontSize(size: number): void;

    /**
     * Set total album animation duration
     * @param duration album animation duration @default 5
     */
    setDuration(duration: number): void;

    /**
     * Set background color
     * @param color
     */
    setBackgroundColor(color: string): void;
    setBackground(color: string): void;

    /**
     * Set text color value
     * @param color
     */
    setColor(color: string): void;

    /**
     * Set text font file path
     * @param path
     */
    setFont(path: string): void;

    /**
     * Set text style by object
     * @param style
     */
    setStyle(style: Record<string, any>): void;
  }
}
