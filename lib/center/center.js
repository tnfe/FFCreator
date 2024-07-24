'use strict';

/**
 * FFCreatorCenter - A global FFCreator task scheduling center.
 * You don’t have to use it, you can easily implement a task manager by yourself.
 *
 * ####Example:
 *
 *     FFCreatorCenter.addTask(()=>{
 *       const creator = new FFCreator;
 *       return creator;
 *     });
 *
 *
 * ####Note:
 *     On the server side, you only need to start FFCreatorCenter,
 *     remember to add error logs to the events in it
 *
 * @object
 */

const util = require('util');
const EventEmitter = require('eventemitter3');
const TaskQueue = require('./task');
const Progress = require('./progress');
const Utils = require('../utils/utils');
const FFLogger = require('../utils/logger');
const FFmpegUtil = require('../utils/ffmpeg');

const FFCreatorCenter = {
  cursor: 0,
  num: 0,
  delay: 500,
  state: 'free',
  log: false,
  temps: {},
  progress: new Progress(),
  event: new EventEmitter(),
  taskQueue: new TaskQueue(),

  /**
   * Close logger switch
   * @public
   */
  closeLog() {
    FFLogger.enable = false;
  },

  /**
   * Open logger switch
   * @public
   */
  openLog() {
    FFLogger.enable = true;
  },

  openCatchLog() {
    this.log = true;
  },

  /**
   * Add a production task
   * @param {function} task - a production task
   * @public
   */
  addTask(task) {
    const id = this.taskQueue.push({ task });
    if (this.state === 'free') this.start();
    return id;
  },

  /**
   * Add a production task by template
   * @param {string} tempid - a template id
   * @public
   */
  addTaskByTemplate(id, params) {
    const task = this.temps[id];
    const tid = this.taskQueue.push({ task, params });
    if (this.state === 'free') this.start();

    return tid;
  },

  /**
   * Listen to production task events
   * @param {string} id - a task id
   * @param {strint} eventName - task name
   * @param {function} func - task event handler
   * @public
   */
  onTask(id, eventName, func) {
    const handler = result => {
      if (result.id == id) {
        this.event.removeListener(eventName, handler);
        // this.removeTaskObj(eventName, result);
        func(result);
      }
    };

    this.event.on(eventName, handler);
  },

  removeTaskObj(eventName, result) {
    // remove taskObj after 5s
    if (eventName === 'single-error' || eventName === 'single-complete') {
      setTimeout(() => {
        const { taskObj } = result;
        this.taskQueue.remove(taskObj);
      }, 5000);
    }
  },

  /**
   * Listen to production task Error events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskError(id, func) {
    this.onTask(id, 'single-error', func);
  },

  /**
   * Listen to production task Complete events
   * @param {string} id - a task id
   * @param {function} func - task event handler
   * @public
   */
  onTaskComplete(id, func) {
    this.onTask(id, 'single-complete', func);
  },

  /**
   * Start a task
   * @async
   * @public
   */
  async start() {
    const taskObj = this.taskQueue.getTaskByIndex(this.cursor);
    this.execTask(taskObj);
  },

  /**
   * Get the status of a task by id
   * @public
   */
  getTaskState(id) {
    return this.taskQueue.getTaskState(id);
  },

  getInfo() {
    const { cursor, num } = this;
    const tasks = this.taskQueue.getLength();
    return { num, cursor, tasks };
  },

  getResultFile(id) {
    return this.taskQueue.getResultFile(id);
  },

  getProgress(id) {
    return this.progress.getPercent(id);
  },

  async execTask(taskObj) {
    this.state = 'busy';
    try {
      this.num++;
      this.cursor++;
      const { task, params } = taskObj;
      const creator = await task(params);

      if (!creator) {
        this.handlingError({
          taskObj,
          error: 'execTask: await taskObj.task(taskObj.id) return null',
        });
      } else {
        this.initCreator(creator, taskObj);
      }
    } catch (error) {
      if (this.log) console.log(error);
      this.handlingError({ taskObj, error });
    }
  },

  initCreator(creator, taskObj) {
    if (creator.destroyed) {
      return setTimeout(this.nextTask.bind(this), this.delay);
    }

    creator.inCenter = true;
    creator.generateOutput();

    // event listeners
    creator.on('start', () => {
      const result = { id: taskObj.id, taskObj };
      this.event.emit('single-start', result);
    });

    creator.on('error', event => {
      this.handlingError({ taskObj, error: event });
    });

    creator.on('progress', progress => {
      this.progress.id = taskObj.id;
      this.progress.state = progress.state;
      this.progress.percent = progress.percent;
    });

    creator.on('complete', () => {
      try {
        const { id } = taskObj;
        const file = creator.getFile();
        taskObj.state = 'complete';
        taskObj.file = file;
        this.progress.add(id);
        this.taskQueue.store(id);

        const result = { id, file, taskObj };
        this.event.emit('single-complete', result);
        FFLogger.info(`Creator production completed. id:${id} file: ${file}`);
      } catch (error) {
        FFLogger.error(`Creator production error. ${util.inspect(error)}`);
      }

      setTimeout(this.nextTask.bind(this), this.delay);
    });
  },

  handlingError({ taskObj, error = 'normal' }) {
    error = Utils.getErrStack(error);
    const result = { id: taskObj.id, taskObj, error };
    taskObj.state = 'error';
    this.event.emit('single-error', result);
    setTimeout(this.nextTask.bind(this), this.delay);

    FFLogger.error(`Creator production error. ${util.inspect(error)}`);
  },

  nextTask() {
    if (this.cursor >= this.taskQueue.getLength()) {
      this.resetTasks();
      this.event.emit('all-complete');
      return;
    }

    const taskObj = this.taskQueue.getTaskByIndex(this.cursor);
    this.execTask(taskObj);
  },

  resetTasks() {
    this.cursor = 0;
    this.state = 'free';
    this.taskQueue.clear();
  },

  /**
   * add a creator task template
   *
   * @param {string} id - task template id name
   * @param {function} taskFunc - task template
   * @public
   */
  createTemplate(id, taskFunc) {
    this.temps[id] = taskFunc;
  },

  /**
   * Set the installation path of the current server ffmpeg.
   * If not set, the ffmpeg command of command will be found by default.
   *
   * @param {string} path - installation path of the current server ffmpeg
   * @public
   */
  setFFmpegPath(path) {
    FFmpegUtil.setFFmpegPath(path);
  },

  /**
   * Set the installation path of the current server ffprobe.
   * If not set, the ffprobe command of command will be found by default.
   *
   * @param {string} path - installation path of the current server ffprobe
   * @public
   */
  setFFprobePath(path) {
    FFmpegUtil.setFFprobePath(path);
  },

  setFFPath() {
    FFmpegUtil.setFFPath();
  }
};

module.exports = FFCreatorCenter;
