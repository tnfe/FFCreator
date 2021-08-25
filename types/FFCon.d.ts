declare namespace FFCreatorSpace {
  /**
   * FFCon - display object container.
   *
   * @example:
   *
   *     class FFScene extends FFCon
   *
   */
  class FFCon extends FFBase {
    /**
     * Clear all child elements and add unique elements
     */
    addOnlyDisplayChild(): void;

    addChild(child: FFNode | FFCon): void;

    /**
     * Clear all child elements and add unique elements
     * @param child
     */
    addOnlyDisplayChild(child: FFNode | FFCon): void;

    /**
     * Show only display child object
     * @param scene
     */
    showOnlyDisplayChild(scene: FFNode): void;

    removeChild(childe: FFNode): void;
  }
}
