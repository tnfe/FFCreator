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
   *
   */
  interface FFCreatorCenter {
    /**
     * Close logger switch
     */
    closeLog(): void;

    /**
     * Open logger switch
     */
    openLog(): void;

    /**
     * Add a production task
     * @param task a production task
     */
    addTask(task: () => void): string;

    /**
     * Add a production task by template
     * @param id a template id
     * @param params
     */
    addTaskByTemplate(id: string, params: Record<string, any>): string;

    /**
     * Listen to production task events
     * @param id  a task id
     * @param eventName task name
     * @param fun task event handler
     */
    onTask(id: string, eventName: string, fun: EventListener): void;

    /**
     * Listen to production task Error events
     * @param id a task id
     * @param fun task event handler
     */
    onTaskError(id: string, fun: EventListener): void;

    /**
     * Listen to production task Complete events
     * @param id a task id
     * @param fun task event handler
     */
    onTaskComplete(id: string, fun: EventListener): void;

    /**
     * Start a task
     */
    start(): Promise<unknown>;

    /**
     * Get the status of a task by id
     * @param id task id
     */
    getTaskState(id: string): FFCreatorTaskState;

    /**
     * add a creator task template
     * @param id task template id name
     * @param fun task template
     */
    createTemplate(id: string, fun: EventListener): void;

    /**
     * Set the installation path of the current server ffmpeg.
     * If not set, the ffmpeg command of command will be found by default.
     * @param path installation path of the current server ffmpeg
     */
    setFFmpegPath(path: string): void;

    /**
     * Set the installation path of the current server ffprobe.
     * If not set, the ffprobe command of command will be found by default.
     * @param path installation path of the current server ffprobe
     */
    setFFprobePath(path: string): void;

    /**
     * get task progress by task id
     * @param id
     */
    getProgress(id: string): number;

    /**
     * reset all tasks
     */
    resetTasks(): void;

    getInfo(): string;

    getResultFile(id: string): unknown;
  }

  const FFCreatorCenter: FFCreatorCenter;
}
