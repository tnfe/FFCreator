const fFmpegUtil = require('@/utils/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

jest.mock('fluent-ffmpeg');

describe('utils/ffmpeg', () => {
  test('getFFmpeg: should return ffmpeg', () => {
    const instance = fFmpegUtil.getFFmpeg();
    expect(instance).toBe(ffmpeg);
  });

  test('setFFmpegPath: invoking ffmpeg.setFFmpegPath once', () => {
    fFmpegUtil.setFFmpegPath('/');
    expect(ffmpeg.setFfmpegPath).toBeCalledTimes(1);
  });

  test('setFFprobePath: invoking ffmpeg.setFFprobePath once', () => {
    fFmpegUtil.setFFprobePath('/');
    expect(ffmpeg.setFfprobePath).toBeCalledTimes(1);
  });

  describe('concatOpts: extra config should insert opts', () => {
    test('extra config is Array', () => {
      const opts = [{ name: 'test' }];
      const arr = [{ name: 'test1' }, { name: 'test2' }];
      fFmpegUtil.concatOpts(opts, arr);
      expect(opts.length).toBe(3);
    });

    test('extra config is Object', () => {
      const opts = [{ name: 'test' }];
      const obj = { name: 'test1' };
      fFmpegUtil.concatOpts(opts, obj);
      expect(opts.length).toBe(2);
    });
  });

  test('createCommand: should return command', () => {
    fFmpegUtil.createCommand();
    expect(ffmpeg).toBeCalledTimes(1);
  });
});
