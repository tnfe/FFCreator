/// <reference path="FFCon.d.ts" />
/// <reference path="FFEventer.d.ts" />

declare namespace FFCreatorSpace {
  type NodeType = 'album' | 'image' | 'node' | 'scene' | 'subtitle' | 'text' | 'video' | 'vtuber';

  type ConfType = 'base' | 'con' | 'node' | NodeType;

  interface FFBaseConf extends ConfOptions {
    /**
     * 配置种类
     * @default base
     */
    type?: ConfType;
  }

  /**
   * FFBase - Basic classes in FFCreator. Note: Its subclass is not necessarily a display class.
   *
   * @example
   *  class FFCon extends FFBase
   */
  class FFBase extends FFEventer {
    conf: FFBaseConf;
    parent: null | unknown;
    constructor(conf: FFBaseConf);

    /**
     * Generate self-increasing unique id
     */
    genId(): string;

    /**
     * Get the logical root node of the instance
     */
    root(): FFBase;

    /**
     * Get the conf configuration on the logical root node of the instance
     * If the val parameter is set, the val value of conf is set
     * @param  key - configuration key
     * @param  val - configuration val
     * @return {object|any} root node
     */
    rootConf(key: string, val: any): any | object;
  }
}
