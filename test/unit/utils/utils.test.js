const utils = require('@/utils/utils')

describe('utils/utils', ()=> {
  test('generateID: Generate auto-increment id based on type ', ()=> {
    const result = utils.genId('hello')
    expect(result).toBe("hello_1")
  })

  test('uid: Generate 24-bit random number ', ()=> {
    const result = utils.genUuid()
    expect(result).toStrictEqual(expect.any(String))
  })

  test('deleteArrayElement: Delete an element of the array ', ()=> {
    const result = utils.deleteArrayElement([1,2],1)
    expect(result).toEqual([2])
  })

  test('swapArrayElement: Swap two elements of an array ', ()=> {
    const result = utils.swapArrayElement([1],1,2)
    expect(result).toStrictEqual(expect.any(Array))
  })

  test('isArray2D: Determine whether an array is a 2-latitude array ', ()=> {
    const result = utils.isArray2D([[]])
    expect(result).toBe(true)
  })

  test('deleteUndefined: Remove undefined empty elements ', ()=> {
    const result = utils.deleteUndefined({1:undefined})
    expect(result).toEqual({})
  })

  test('destroyObj: Destroy the elements in object ', ()=> {
    const Obj = {1:1}
    utils.destroyObj(Obj,)
    expect(Obj).toEqual({})
  })

  test('mergeExclude: Merge one object into another object ', ()=> {
    const result = utils.mergeExclude({1:1}, {2:2})
    expect(result).toEqual({1:1,2:2})
  })

  test('floor', ()=> {
    const result = utils.floor(10)
    expect(result).toBe(10)
  })

  test('fixFolderPath: Fix wrong file directory path // -> / ', ()=> {
    const result = utils.fixFolderPath('//')
    expect(result).toBe('/')
  })

  test('getErrStack', ()=> {
    const result = utils.getErrStack('测试')
    expect(result).toBe('测试')
  })
})
