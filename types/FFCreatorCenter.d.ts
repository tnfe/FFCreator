declare namespace FFCreatorSpace {
  type FFCreatorTaskState = 'waiting' | 'complete' | 'unknown' | 'error';

  type EventListener = (e: unknown) => void;

  /**
   * FFCreatorCenter - A global FFCreator task scheduling center.
   * You don’t have to use it, you can easily implement a task manager by yourself.
   *
   * @example
   *
   *     FFCreatorCenter.addTask(()=>{
   *       const creator = new FFCreator;
   *       return creator;
   *     });
   *
   *
   * @description
   *     On the server side, you only need to start FFCreatorCenter,
   *     remember to add error logs to the events in it
   *ß
   */
  class FFCreatorCenter {
    static closeLog(): void;

    static openLog(): void;

    static addTask(task: () => void): string;

    static addTaskByTemplate(id: string, params: Record<string, any>): string;

    static onTask(id: string, eventName: string, fun: EventListener): void;

    static onTaskError(id: string, fun: EventListener): void;

    static onTaskComplete(id: string, fun: EventListener): void;

    static onTaskComplete(id): void;

    static start(): Promise<unknown>;

    static getTaskState(id: string): FFCreatorTaskState;

    static setFFmpegPath(path: string): void;

    static setFFprobePath(path: string): void;

    static getProgress(id: string): void;

    static resetTasks(): void;
  }
}
