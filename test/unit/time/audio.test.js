const FFAudio = require('@/audio/audio');
const FFClip = require('@/core/clip');

describe('time/audio', () => {
  test('audio: default start/duration/end with loop default false', () => {
    const audio = new FFAudio({});
    audio.material = { length: 3 };
    audio.parent = { start: 0, duration: 10 }
    expect(audio.start).toBe(0);
    expect(audio.duration).toBe(3);
    expect(audio.end).toBe(3);

    audio.material.length = 13;
    expect(audio.duration).toBe(13);
    expect(audio.end).toBe(13);

    audio.prevSibling = { end: 5 };
    expect(audio.start).toBe(5);
    expect(audio.duration).toBe(13);
    expect(audio.end).toBe(18);

    audio.conf.start = 6;
    expect(audio.start).toBe(6);
    expect(audio.duration).toBe(13);
    expect(audio.end).toBe(19);

    audio.conf.duration = 5;
    expect(audio.start).toBe(6);
    expect(audio.duration).toBe(5);
    expect(audio.end).toBe(11);
  });

  test('audio: default start/duration/end with loop set true', () => {
    const audio = new FFAudio({ loop: true });
    audio.material = { length: 3 };
    audio.parent = { start: 0, duration: 10 }
    expect(audio.start).toBe(0);
    expect(audio.duration).toBe(10);
    expect(audio.end).toBe(10);

    audio.material.length = 13;
    expect(audio.duration).toBe(10);
    expect(audio.end).toBe(10);

    audio.prevSibling = { end: 6 };
    expect(audio.start).toBe(6);
    expect(audio.duration).toBe(4);
    expect(audio.end).toBe(10);

    audio.conf.start = 3;
    expect(audio.start).toBe(3);
    expect(audio.duration).toBe(7);
    expect(audio.end).toBe(10);

    audio.conf.duration = 5;
    expect(audio.start).toBe(3);
    expect(audio.duration).toBe(5);
    expect(audio.end).toBe(8);
  });

  test('audio: set duration over material length', () => {
    const audio = new FFAudio({ duration: 10 });
    audio.material = { length: 6 };
    audio.parent = { start: 0, duration: NaN };
    expect(audio.duration).toBe(10);

    const clip = new FFClip({ start: -4 });
    audio.addChild(clip);
    expect(clip.start).toBe(6);
    expect(clip.duration).toBe(4);
    expect(clip.end).toBe(10);
  });
});