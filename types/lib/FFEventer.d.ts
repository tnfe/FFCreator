declare namespace FFCreatorSpace {
  type FFEventType = 'normal' | string;

  interface FFEventOptions {
    type: FFEventType;
    [key: string]: unknown;
  }

  interface FFEventerErrorOptions {
    pos: unknown;
    error: Record<string, unknown>;
  }

  /**
   * FFEvent - A FFCreator customized event class.
   *
   * @example
   *
   *  const event = new FFEvent({type: 'start'});
   *  event.state = 'begin';
   */
  // class FFEvent {
  // 	constructor(options: FFEventOptions);
  // }

  /**
   * FFEventer - An auxiliary incident management eventer
   * Used to manage events such as start, processing, error, etc., which can better save memory overhead.
   *
   * @example
   *
   *     const events = new FFEventer(this);
   *     events.emit({type: 'start'});
   *     events.emit({type: 'complete'});
   *
   */
  class FFEventer {
    /**
     * Trigger the progress event
     * @param data
     */
    emitProgress(data: Record<string, unknown>): void;

    /**
     * Trigger an error event, you can locate the location of the error
     * @param error
     */
    emitError(error: FFEventerErrorOptions): void;

    /**
     * Trigger an ordinary event
     * @param type
     * @param args
     */
    emit(event: string | symbol, ...args: any[]): boolean;

    /**
     * Bundle bubbling function
     * @param eventer
     * @todo 从源代码中没有看懂是什么类型，需要在调用时判断
     */
    bubble(eventer: unknown): void;

    destory(): void;
  }
}
