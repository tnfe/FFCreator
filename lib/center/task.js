'use strict';

/**
 * TaskQueue - Task queue, representing a production task
 *
 *
 * @class
 */

const clone = require('lodash/clone');
const forEach = require('lodash/forEach');
const Utils = require('../utils/utils');

class TaskQueue {
  constructor() {
    this.queue = [];
    this.storeData = {};
  }

  /**
   * Add a subtask to the end of the task queue
   * @param {function} task - a task handler function
   * @return {string} task id
   * @public
   */
  push({ task, params = {} }) {
    const id = Utils.genUuid();
    const paramsWithId = { ...params, taskId: id };
    this.queue.push({ id, task, params: paramsWithId, state: 'waiting', file: null });
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
    forEach(this.queue, obj => Utils.destroyObj(obj));
    this.queue.length = 0;
  }

  /**
   * Store all make complete data
   * @public
   */
  store(id) {
    const taskObj = this.getTaskById(id);
    if (!taskObj) return;

    const cloneTaskObj = clone(taskObj);
    this.storeData[id] = cloneTaskObj;

    // 15 min after delete
    setTimeout(() => {
      delete this.storeData[id];
    }, 15 * 60 * 1000);
  }

  getLength() {
    return this.queue.length;
  }

  /**
   * Get the status of a task by id
   * @public
   */
  getTaskState(id) {
    const taskObj = this.getTaskById(id);
    return taskObj ? taskObj.state : 'unknown';
  }

  /**
   * Get the result file by id
   * @public
   */
  getResultFile(id) {
    const taskObj = this.getTaskById(id);
    return taskObj ? taskObj.file : null;
  }

  /**
   * Get the task from queue
   * @public
   */
  getTaskById(id) {
    for (let i = 0; i < this.queue.length; i++) {
      const taskObj = this.queue[i];
      if (id === taskObj.id) return taskObj;
    }

    for (let key in this.storeData) {
      const cloneTaskObj = this.storeData[key];
      if (id === cloneTaskObj.id) return cloneTaskObj;
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

module.exports = TaskQueue;
