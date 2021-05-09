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
const EventEmitter = require('events');
const forEach = require('lodash/forEach');
const Utils = require('../utils/utils');
const FFLogger = require('../utils/logger');
const FFmpegUtil = require('../utils/ffmpeg');

/**
 * TaskQueue - Task queue, representing a production task
 * @class
 */
class TaskQueue {
  constructor() {
    this.queue = [];
  }

  /**
   * Add a subtask to the end of the task queue
   * @param {function} task - a task handler function
   * @return {string} task id
   * @public
   */
  push({ task, params = {} }) {
    const id = Utils.uid();
    const paramsWithId = { ...params, taskId: id };
    this.queue.push({ id, task, params: paramsWithId, state: 'waiting' });
    return id;
  }

  /**
   * Delete a task from the task queue
   * @param {object} taskObj - a task config object
   * @return {number} the task index
   * @public
   */
  remove(taskObj) {
    const index = this.queue.indexOf(taskObj);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
    return index;
  }

  /**
   * Clear all tasks in the queue
   * @public
   */
  clear() {
    // clear object after 15s
    forEach(this.queue, taskObj => {
      setTimeout(() => {
        Utils.destroyObj(taskObj);
      }, 15 * 1000);
    });
    this.queue.length = 0;
  }

  getLength() {
    return this.queue.length;
  }

  /**
   * Get the status of a task by id
   * @public
   */
  getTaskState(id) {
    for (let taskObj of this.queue) {
      if (id === taskObj.id) return taskObj.state;
    }

    return 'unknown';
  }

  /**
   * Get the result file by id
   * @public
   */
  getResultFile(id) {
    for (let taskObj of this.queue) {
      if (id === taskObj.id) return taskObj.file;
    }

    return null;
  }

  /**
   * Get a task by index
   * @public
   */
  getTaskByIndex(index) {
    if (index < this.queue.length) {
      return this.queue[index];
    }

    return null;
  }
}

/**
 * Progress - A class used to calculate the production progress
 * @class
 */
class Progress {
  constructor(max) {
    this.id = -1;
    this.ids = [];
    this.percent = 0;
    this.max = max || 20;
  }

  add(id) {
    this.ids.push(id);
    if (this.ids.length > this.max) this.ids.shift();
  }

  getPercent(id) {
    if (this.id == id) {
      return this.percent;
    } else if (this.ids.indexOf(id) > -1) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * FFCreatorCenter - A global FFCreator task scheduling center.
 * @object
 */
const FFCreatorCenter = {
  cursor: 0,
  delay: 500,
  state: 'free',
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

  getResultFile(id) {
    return this.taskQueue.getResultFile(id);
  },

  getProgress(id) {
    return this.progress.getPercent(id);
  },

  async execTask(taskObj) {
    this.state = 'busy';
    try {
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
      this.handlingError({ taskObj, error });
    }
  },

  initCreator(creator, taskObj) {
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
        this.progress.add(taskObj.id);
        const file = creator.getFile();
        const result = { id: taskObj.id, file, taskObj };
        taskObj.state = 'complete';
        taskObj.file = file;
        this.event.emit('single-complete', result);
        FFLogger.info(`Creator production completed. id:${result.id} file: ${file}`);
      } catch (e) {}

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
};

module.exports = FFCreatorCenter;
