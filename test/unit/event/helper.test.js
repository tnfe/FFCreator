const Helper = require('@/event/helper')

describe('event/helper', ()=> {
  let helper = null
  const target = {
    emit: jest.fn(()=> {})
  }
  test('create helper instance', ()=> {
    helper = new Helper(target)
    expect(helper).toBeInstanceOf(Helper)
  })

  test('calAndEmitProgress: should emit progress and set value', ()=> {
    helper.calAndEmitProgress({type: 'test', state: 'success', percent: 0})
    expect(target.emit).toHaveBeenCalled()
    expect(helper.progressEvent.percent).toBe(0)
  })

  test('emitProgress: should called target.emit', ()=> {
    helper.emitProgress()
    expect(target.emit).toHaveBeenCalled()
  })

  test('emit: should called target.emit', ()=> {
    helper.emit()
    expect(target.emit).toHaveBeenCalled()
  })

  test('emitError: should called target.emit', ()=> {
    helper.emitError({type: 'test', pos: 0, error: 'error', errorType: 1})
    expect(target.emit).toHaveBeenCalled()
  })

  test('destroy: target should be null', ()=> {
    helper.destroy()
    expect(helper.target).toBeNull()
  })

  test('bind: return bind function', ()=> {
    const fn = helper.bind('test')
    expect(fn).toBeInstanceOf(Function)
  })
})