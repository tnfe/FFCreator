const Audio = require('@/audio/audio')

describe('audio/audio', ()=> {
  test('instantiation Audio success', ()=> {
    const audio = new Audio('/test.mp3')

    expect(audio.path).toBe('/test.mp3')
    expect(audio.start).toBe(0)
    expect(audio.loop).toBeFalsy()
    expect(audio.bg).toBeFalsy()
  })
})