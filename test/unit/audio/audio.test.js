const Audio = require('@/audio/audio')

describe('audio/audio', ()=> {
  test('instantiation Audio success', ()=> {
    const audio = new Audio('/test.mp3')
    // expect(audio.material.path).toBe('/test.mp3')
    expect(audio.startTime).toBe(0)
    expect(audio.loop).toBeFalsy()
    expect(audio.bg).toBeFalsy()
  })
})