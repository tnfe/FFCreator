declare namespace FFCreatorSpace {
  type AnamiationEaseTypes =
    | 'Linear.None'
    | 'Quadratic.In'
    | 'Quadratic.Out'
    | 'Quadratic.InOut'
    | 'Cubic.In'
    | 'Cubic.Out'
    | 'Cubic.InOut'
    | 'Quartic.In'
    | 'Quartic.Out'
    | 'Quartic.InOut'
    | 'Quintic.In'
    | 'Quintic.Out'
    | 'Quintic.InOut'
    | 'Sinusoidal.In'
    | 'Sinusoidal.Out'
    | 'Sinusoidal.InOut'
    | 'Exponential.In'
    | 'Exponential.Out'
    | 'Exponential.InOut'
    | 'Circular.In'
    | 'Circular.Out'
    | 'Circular.InOut'
    | 'Elastic.In'
    | 'Elastic.Out'
    | 'Elastic.InOut'
    | 'Back.In'
    | 'Back.Out'
    | 'Back.InOut'
    | 'Bounce.In'
    | 'Bounce.Out'
    | 'Bounce.InOut';

  interface FFAnimationConf {
    from: Record<string, any>;
    to: Record<string, any>;
    time: number;
    delay: number;
    /**
     * 动画效果
     * @link https://github.com/tweenjs/tween.js/blob/master/src/Easing.ts
     */
    ease: AnamiationEaseTypes;
  }

  type EffectTypes =
    | 'fadeIn'
    | 'fadeOut'
    | 'fadeInLeft'
    | 'fadeInRight'
    | 'fadeInUp'
    | 'fadeInDown'
    | 'fadeInLeftBig'
    | 'fadeInRightBig'
    | 'fadeInUpBig'
    | 'fadeInDownBig'
    | 'fadeOutLeft'
    | 'fadeOutRight'
    | 'fadeOutUp'
    | 'fadeOutDown'
    | 'fadeOutLeftBig'
    | 'fadeOutRightBig'
    | 'fadeOutUpBig'
    | 'fadeOutDownBig'
    | 'blurIn'
    | 'blurOut'
    | 'backIn'
    | 'backOut'
    | 'backInLeft'
    | 'backInRight'
    | 'backInUp'
    | 'backInDown'
    | 'backOutLeft'
    | 'backOutRight'
    | 'backOutUp'
    | 'backOutDown'
    | 'bounceIn'
    | 'bounceInDown'
    | 'bounceInUp'
    | 'bounceInLeft'
    | 'bounceInRight'
    | 'bounceOut'
    | 'bounceOutDown'
    | 'bounceOutLeft'
    | 'bounceOutRight'
    | 'bounceOutUp'
    | 'rotateIn'
    | 'rotateOut'
    | 'rotateInDownLeft'
    | 'rotateInDownRight'
    | 'rotateInUpLeft'
    | 'rotateInUpRight'
    | 'rotateOutDownLeft'
    | 'rotateOutDownRight'
    | 'rotateOutUpLeft'
    | 'rotateOutUpRight'
    | 'rollIn'
    | 'rollOut'
    | 'zoomIn'
    | 'zoomInDown'
    | 'zoomInLeft'
    | 'zoomInRight'
    | 'zoomInUp'
    | 'zoomOut'
    | 'zoomOutDown'
    | 'zoomOutLeft'
    | 'zoomOutRight'
    | 'zoomOutUp'
    | 'slideInDown'
    | 'slideInLeft'
    | 'slideInRight'
    | 'slideInUp'
    | 'slideOutDown'
    | 'slideOutLeft'
    | 'slideOutRight'
    | 'slideOutUp'
    | 'zoomingIn'
    | 'zoomingOut'
    | 'moveingLeft'
    | 'moveingRight'
    | 'moveingUp'
    | 'moveingBottom'
    | 'fadingIn'
    | 'fadingOut'
    | string;

  /**
   * effect 相关配置
   */
  interface FFEffectConf {
    /**
     * 动画类型可以在animate.css这里查询。
     * @link https://animate.style/
     * @link https://github.com/tnfe/FFCreator/blob/master/lib/animate/effects.js
     */
    type: EffectTypes;
    time: number;
    delay: number;
  }
}
