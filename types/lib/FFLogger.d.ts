declare namespace FFCreatorSpace {
  interface LogInfo {
    pos?: number;
    msg: string;
    error?: string;
  }

  type LogType = LogInfo | string;
  /**
   *  FFLogger - Simple, pretty and unified management logger for FFCreator
   *
   * @example
   *
   *     FFLogger.info({ msg: "hello info" });
   *     FFLogger.error("This component must enter the width!");
   */
  interface FFLogger {
    /**
     * Print information to the command line
     * @param info
     */
    info(info: LogType): void;

    /**
     * Print information to the command line
     * @param info
     */
    log(info: LogType): void;

    /**
     * Print error message to the command line
     * @param error
     */
    error(error: LogType): void;
  }

  const FFLogger: FFLogger;
}
