const Logger = require('@/utils/logger');

describe('utils/logger', () => {
  beforeAll(() => {
    global.console = {
      info: jest.fn(() => {}),
      log: jest.fn(() => {}),
      error: jest.fn(() => {}),
    };
  });

  test('info: log info', () => {
    const fn = jest.fn(() => {});
    Logger.addCallback('info', fn);
    Logger.info('test');
    expect(fn).toHaveBeenCalled();
  });

  test('log: log info', () => {
    const fn = jest.fn(() => {});
    Logger.addCallback('log', fn);
    Logger.log('test');
    expect(fn).toHaveBeenCalled();
  });

  test('error: error info', () => {
    const fn = jest.fn(() => {});
    Logger.addCallback('error', fn);
    Logger.error('test');
    expect(fn).toHaveBeenCalled();
  });
});
