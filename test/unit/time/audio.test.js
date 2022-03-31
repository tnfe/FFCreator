const FFAudio = require('@/audio/audio');
const FFClip = require('@/core/clip');

describe('time/audio', () => {
  test('audio: default start/duration/end with loop default false', () => {
    const audio = new FFAudio({});
    audio.material = { getDuration: () => 3 };
    audio.parent = { startTime: 0, duration: 10 }
    expect(audio.startTime).toBe(0);
    expect(audio.duration).toBe(3);
    expect(audio.endTime).toBe(3);

    audio.material = { getDuration: () => 13 };
    expect(audio.duration).toBe(13);
    expect(audio.endTime).toBe(13);

    audio.prevSibling = { endTime: 5 };
    expect(audio.startTime).toBe(5);
    expect(audio.duration).toBe(13);
    expect(audio.endTime).toBe(18);

    audio.conf.start = 6;
    expect(audio.startTime).toBe(6);
    expect(audio.duration).toBe(13);
    expect(audio.endTime).toBe(19);

    audio.conf.duration = 5;
    expect(audio.startTime).toBe(6);
    expect(audio.duration).toBe(5);
    expect(audio.endTime).toBe(11);
  });

  test('audio: default start/duration/end with loop set true', () => {
    const audio = new FFAudio({ loop: true });
    audio.material = { getDuration: () => 3 };
    audio.parent = { startTime: 0, duration: 10 }
    expect(audio.startTime).toBe(0);
    expect(audio.duration).toBe(10);
    expect(audio.endTime).toBe(10);

    audio.material = { getDuration: () => 13 };
    expect(audio.duration).toBe(10);
    expect(audio.endTime).toBe(10);

    audio.prevSibling = { endTime: 6 };
    expect(audio.startTime).toBe(6);
    expect(audio.duration).toBe(4);
    expect(audio.endTime).toBe(10);

    audio.conf.start = 3;
    expect(audio.startTime).toBe(3);
    expect(audio.duration).toBe(7);
    expect(audio.endTime).toBe(10);

    audio.conf.duration = 5;
    expect(audio.startTime).toBe(3);
    expect(audio.duration).toBe(5);
    expect(audio.endTime).toBe(8);
  });

  test('audio: set duration over material length', () => {
    const audio = new FFAudio({ duration: 10 });
    audio.material = { getDuration: () => 6 };
    audio.parent = { startTime: 0, duration: NaN };
    expect(audio.duration).toBe(10);

    const clip = new FFClip({ start: -4 });
    audio.addChild(clip);
    expect(clip.startTime).toBe(6);
    expect(clip.duration).toBe(4);
    expect(clip.endTime).toBe(10);
  });
});