const Frames = require('@/utils/frames')

describe('utils/frames', () => {

  let frames = null

  test('instantiation: Component needs to succeed', () => {
    frames = new Frames()
    expect(frames).toBeInstanceOf(Frames)
  })

  test('add: Add a single picture frame', () => {
    frames.add(0, 'picture frame')
    expect(frames.frames[0]).toBe('picture frame')
  } )


  test('total: Get the frame length', () => {
    expect(frames.total()).toBe(1)
  })

  test('get: Get the frame ', () => {
    expect(frames.get(0)).toBe('picture frame')
  })

  test('empty: Clear all frames', () => {

    frames.destroy = jest.fn();
    frames.empty()
    expect(frames.destroy).toHaveBeenCalled();
  })

  test('testing: Test how many empty frames', () => {

    frames.forEach = jest.fn();
    frames.testing()
    expect(frames.forEach).toHaveBeenCalled();
  })

  test('noEmptyFrame: Check for empty frames', () => {
    expect(frames.noEmptyFrame()).toBe(true)
  })

  test('forEach: fun excute once', ()=> {
    const mockFn = jest.fn(()=> {})
    frames.forEach(mockFn)
    expect(mockFn).toHaveBeenCalledTimes(0)
  })


}

)
