const FFBase = require('@/core/base')

jest.mock('events')
jest.mock('@/conf/conf', ()=> ({
  getFakeConf: jest.fn(()=> ({}))
}))
jest.mock('@/utils/utils', ()=> ({
  generateID: jest.fn(()=> 1)
}))

describe('core/base', ()=> {
  let base = null

  test('instantiation component needs to succeed', ()=> {
    base = new FFBase()
    expect(base).toBeInstanceOf(FFBase)
  })

  test('generateID: set id success', ()=> {
    base.generateID()
    expect(base.id).toBe(1)
  })

  test('root: should return self', ()=> {
    expect(base.root()).toBe(base)
  })

  test('rootConf: should return conf', ()=> {
    const conf = base.rootConf()
    expect(conf).toMatchObject({})
  })

  test('destroy: destroy function invoke success', ()=> {
    base.destroy()
    expect(base.parent).toBeFalsy()
  })
})