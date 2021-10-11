declare namespace FFCreatorSpace {
  interface FFFRectConf extends FFNodeCommonConf {
    /**
     * rect color
     * @default #044EC5
     */
    color?: string;
    width?: number;
    height?: number;
  }

  class FFRect extends FFNode {
    constructor(conf: FFFRectConf);
    setColor(color: string): void;
  }
}
