declare namespace FFCreatorSpace {
  type FFTweenAnimationInfo = Record<string, any>;

  /**
   *  FFTween - The tween class that controls the animation movement of the display element
   *
   * @example
   *
   *     FFTween.to(node, .5,{ x: 100, y: 100 });
   *     FFTween.fromTo(node, .5, { opacity: 0, y: 100 }, { opacity: 1, y: 0 });
   *
   */
  interface FFTween {
    /**
     * Tween to easing animation
     * @param target
     * @param time
     * @param toObj
     */
    to(target: FFNode, time: number, toObj: FFTweenAnimationInfo): void;

    /**
     * Think of a from() like a backwards tween where you define where the values should START
     * @param target
     * @param time
     * @param fromObj
     */
    from(target: FFNode, time: number, fromObj: FFTweenAnimationInfo): void;

    /**
     * Lets you define BOTH the starting and ending values for an animation (as opposed to from()
     * and to() tweens which use the current state as either the start or end).
     * @param target
     * @param time
     * @param fromObj
     * @param toObj
     */
    fromTo(
      target: FFNode,
      time: number,
      fromObj: FFTweenAnimationInfo,
      toObj: FFTweenAnimationInfo,
    ): void;

    /**
     * Control the tween animation method of the underlying sprite
     * @param target
     * @param time
     * @param fromObj
     * @param toObj
     */
    spriteTweenFromTo(
      target: FFNode,
      time: number,
      fromObj: FFTweenAnimationInfo,
      toObj: FFTweenAnimationInfo,
    ): void;
  }

  const FFTween: FFTween;
}
