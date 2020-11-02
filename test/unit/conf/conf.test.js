const Conf = require('@/conf/conf.js')

describe('conf/conf', ()=> {
  let conf = null
  test('initialize should be success', ()=> {
    conf = new Conf({pathId: 1})
    expect(conf).toBeInstanceOf(Conf)
  })

  test('getVal: should return correct value', ()=> {
    expect(conf.getVal('debug')).toBeFalsy()
    expect(conf.getVal('defaultOutputOptions')).toBeTruthy()
    expect(conf.getVal('width')).toBe(800)
  })

  test('setVal: should set value success', ()=> {
    conf.setVal('debug', true)
    expect(conf.getVal('debug')).toBeTruthy()
  })
  
  test('getWH: should return width.height', ()=> {
    const wh = conf.getWH('.')
    expect(wh).toBe('800.450')
  })

  test('getCacheDir: should return dir path', ()=> {
    expect(conf.getCacheDir()).toMatch('/')
  })

  test('copyByDefaultVal: should copy value success', ()=> {
    conf.copyByDefaultVal({}, 'test', 'test', 'test')
    const test = conf.getVal('test')
    expect(test).toBe('test')
  })

  test('getFakeConf: should reutn fakeConf', ()=> {
    const fakeConf = Conf.getFakeConf()
    expect(fakeConf.getVal).toBeInstanceOf(Function)
    expect(fakeConf.setVal).toBeInstanceOf(Function)
  })
})