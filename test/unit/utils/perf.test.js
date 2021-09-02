const perf = require('@/utils/perf');

const cpuInfo = expect.objectContaining({ idle: expect.any(Number), total: expect.any(Number) });

describe('utils/perf', () => {
  test('start: Statistics start ', () => {
    perf.start();
    expect(perf.stats1).toEqual(cpuInfo);
  });

  test('end: Statistics end ', () => {
    perf.end();
    expect(perf.old).toStrictEqual(expect.any(Number));
  });

  test('analysis: Statistics end ', () => {
    perf.getMemoryUsage = jest.fn();
    perf.analysis();
    expect(perf.getMemoryUsage).toHaveBeenCalled();
  });

  test('getCpuUsage', () => {
    const result = perf.getCpuUsage();
    expect(result).toStrictEqual(expect.any(String));
  });

  test('getInfo', () => {
    const result = perf.getInfo();
    expect(result).toStrictEqual(expect.stringContaining('time'));
  });

  test('getMemoryUsage', () => {
    const result = perf.getMemoryUsage();
    expect(result).toBeUndefined();
  });

  test('getCpuInfo', () => {
    const result = perf.getCpuInfo();
    expect(result).toEqual(cpuInfo);
  });

  test('getPercent', () => {
    const result = perf.getPercent(0.002, 1);
    expect(result).toBe('0.2%');
  });
});
