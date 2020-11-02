const timeline = require('@/utils/timeline')

describe('utils/timeline', ()=> {
  test('update: Timeline update function ', ()=> {
    const result = timeline.update()
    expect(result).toBeUndefined()
  })

  test('addFrameCallback: Add callback hook ', ()=> {
    timeline.addFrameCallback('func')
    expect(timeline.cbs.length).toBe(1)
  })

  test('removeFrameCallback: remove callback hook ', ()=> {
    timeline.removeFrameCallback('func')
    expect(timeline.cbs.length).toBe(0)
  })

})
