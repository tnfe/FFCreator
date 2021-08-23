'use strict';

/**
 * TaskQueue - Task queue, representing a production task
 *
 *
 * @class
 */

const forEach = require('lodash/forEach');
const Utils = require('../utils/utils');

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
    const id = Utils.genUuid();
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

module.exports = TaskQueue;
