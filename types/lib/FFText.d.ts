declare namespace FFCreatorSpace {
  interface FFTextConf extends FFNodeCommonConf {
    text?: string;
    /**
     * fontSize
     * @default 36
     */
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    /**
     * font file path
     */
    font?: string;
    /**
     * css style
     * @description not support all css style
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

    /**
     * Set text font file path
     * @param path text font file path
     */
    setFont(path: string): void;

    /**
     * Set Text horizontal center function
     */
    alignCenter(): void;

    setWrap(warpWidth: number): void;
  }
}
