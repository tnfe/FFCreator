/** @type {import('../../../lib/center/center')} */
const center = require('@/center/center');
/** @type {import('../../../lib/utils/ffmpeg')} */
const ffmpegUtil = require('@/utils/ffmpeg');
/** @type {import('../../../lib/utils/logger')} */
const FFLogger = require('@/utils/logger');
const FFCreator = require('@/creator');
const EventEmitter = require('eventemitter3');

const noop = () => new FFCreator();

describe('center/center', () => {
  test('FFCreatorCenter initial params', () => {
    expect(center.cursor).toBe(0);
    expect(center.delay).toBe(500);
    expect(center.state).toBe('free');
    expect(center.event).toBeInstanceOf(EventEmitter);
    expect(center.progress).toBeTruthy();
    expect(center.taskQueue).toBeTruthy();
  });

  test('FFCreatorCenter should have these methods', () => {
    expect(center.addTask).toBeTruthy();
    expect(center.addTaskByTemplate).toBeTruthy();
    expect(center.closeLog).toBeTruthy();
    expect(center.createTemplate).toBeTruthy();
    expect(center.execTask).toBeTruthy();
    expect(center.getProgress).toBeTruthy();
    expect(center.getResultFile).toBeTruthy();
    expect(center.getTaskState).toBeTruthy();
    expect(center.handlingError).toBeTruthy();
    expect(center.initCreator).toBeTruthy();
    expect(center.nextTask).toBeTruthy();
    expect(center.onTask).toBeTruthy();
    expect(center.onTaskComplete).toBeTruthy();
    expect(center.onTaskError).toBeTruthy();
    expect(center.openLog).toBeTruthy();
    expect(center.removeTaskObj).toBeTruthy();
    expect(center.resetTasks).toBeTruthy();
    expect(center.setFFmpegPath).toBeTruthy();
    expect(center.setFFprobePath).toBeTruthy();
    expect(center.start).toBeTruthy();
  });

  test('closeLog: should set enable false success', () => {
    center.closeLog();
    expect(FFLogger.enable).toBe(false);
  });

  test('openLog: should set enable true success', () => {
    center.openLog();
    expect(FFLogger.enable).toBe(true);
  });

  test('addTask: should add task success', () => {
    center.addTask(noop);
    expect(center.taskQueue.getLength()).toBe(1);
  });

  test('addTaskByTemplate: should add task success', () => {
    const tempId = '1';
    center.createTemplate(tempId, noop);
    expect(center.temps[tempId]).toBeTruthy();
    center.addTaskByTemplate(tempId, {});
    // addTask has already add 1, so here expect to be 2
    expect(center.taskQueue.getLength()).toBe(2);
  });

  test('setFFmpegPath: should set FFmpegPath success', () => {
    const tmpPath = '/a-demo-path';
    center.setFFmpegPath(tmpPath);
  });

  test('setFFprobePath: should set FFprobePath success', () => {
    const tmpPath = '/a-fake-probe-path';
    center.setFFprobePath(tmpPath);
  });

  test('resetTasks: should set cursor 0', () => {
    center.resetTasks();
    expect(center.cursor).toBe(0);
    expect(center.state).toBe('free');
    expect(center.taskQueue.getLength()).toBe(0);
  });
});
