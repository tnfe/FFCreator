const Fs = require('@/utils/fs')
const fs = require('fs-extra');
const rmfr = require('rmfr')

jest.mock('fs-extra')
jest.mock('rmfr')

describe('utils/fs', ()=> {
  test('ensureDir', ()=> {
    Fs.ensureDir('/')
    expect(fs.ensureDir).toHaveBeenCalled()
  })

  test('rmDir', ()=> {
    Fs.rmDir()
    expect(rmfr).toHaveBeenCalled()
  })

  test('moveFile', ()=> {
    Fs.moveFile({dir: '/', from: 'from', to: 'to', nofix: false})
    expect(fs.move).toHaveBeenCalled()
  })

  test('writeSync', ()=> {
    Fs.writeSync({dir: '/', name: 'test.raw', buffer: []})
    expect(fs.writeFileSync).toHaveBeenCalled()
  })

  test('writeSync', ()=> {
    Fs.writeSync({dir: '/', name: 'test.raw', buffer: []})
    expect(fs.writeFileSync).toHaveBeenCalled()
  })

  test('readFileSync', ()=> {
    Fs.readFileSync({dir: '/', name: 'test.raw'})
    expect(fs.readFileSync).toHaveBeenCalled()
  })

  test('readFileSync', ()=> {
    Fs.readFileSync({dir: '/', name: 'test.raw'})
    expect(fs.readFileSync).toHaveBeenCalled()
  })

  test('writeAsync', async ()=> {
    await Fs.writeAsync({dir: '/', name: 'test.raw'})
    expect(fs.outputFile).toHaveBeenCalled()
  })

  test('writeByGLAsync', async ()=> {
    const gl = {
      readPixels: jest.fn(()=> {})
    }
    Fs.writeByGLAsync({gl, dir: '/', name: 'test.raw', width: 200, height: 200})
    expect(gl.readPixels).toHaveBeenCalled()
    expect(fs.writeFileSync).toHaveBeenCalled()
  })
})