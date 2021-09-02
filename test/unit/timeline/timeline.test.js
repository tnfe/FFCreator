const Timeline = require('@/timeline/timeline')

describe('timeline/timeline', ()=> {
  test('update: Timeline update function ', ()=> {
    const timeline = new Timeline(60);
    timeline.annotate(scenes);
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
