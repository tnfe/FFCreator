const FS = require('@/utils/fs');
const fs = require('fs-extra');
const rmfr = require('rmfr');

jest.mock('fs-extra');
jest.mock('rmfr');

describe('utils/fs', () => {
  test('ensureDir', () => {
    FS.ensureDir('/');
    expect(fs.ensureDir).toHaveBeenCalled();
  });

  test('rmDir', () => {
    FS.rmDir();
    expect(rmfr).toHaveBeenCalled();
  });

  test('moveFile', () => {
    FS.moveFile({ dir: '/', from: 'from', to: 'to', nofix: false });
    expect(fs.move).toHaveBeenCalled();
  });

  test('writeFileSync', () => {
    FS.writeFileSync({ dir: '/', name: 'test.raw', buffer: [] });
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('writeFileSync', () => {
    FS.writeFileSync({ dir: '/', name: 'test.raw', buffer: [] });
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('readFileSync', () => {
    FS.readFileSync({ dir: '/', name: 'test.raw' });
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  test('readFileSync', () => {
    FS.readFileSync({ dir: '/', name: 'test.raw' });
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  test('writeFileAsync', async () => {
    await FS.writeFileAsync({ dir: '/', name: 'test.raw' });
    expect(fs.outputFile).toHaveBeenCalled();
  });
});
