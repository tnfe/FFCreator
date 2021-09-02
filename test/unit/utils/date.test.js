const DateUtil = require('@/utils/date');

describe('utils/date', () => {
  const timestamp = 30009;
  const timestring = '08:20:09';

  test('secondsToHms: should return time string', () => {
    expect(DateUtil.secondsToHms(timestamp)).toBe(timestring);
  });

  test('hmsToSeconds: should return seconds', () => {
    expect(DateUtil.hmsToSeconds(timestring)).toBe(timestamp);
  });

  test('toMilliseconds: should return milliseconds', () => {
    expect(DateUtil.toMilliseconds(0)).toBe(0);
    expect(DateUtil.toMilliseconds(7)).toBe(7000);
  });

  test('toSeconds: should return seconds', () => {
    expect(DateUtil.toSeconds(0)).toBe(0);
    expect(DateUtil.toSeconds(7000)).toBe(7);
  });
});
