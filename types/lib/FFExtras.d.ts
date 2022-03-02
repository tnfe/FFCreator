declare namespace FFCreatorSpace {

  class FFExtras extends FFNode {
    constructor(conf: FFBaseConf);

    init?: Function;
    update?: Function;
    destroyed?: Function;
  }
}
