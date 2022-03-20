const FFClip = require('@/core/clip');

describe('time/clip', () => {
  test('clip: default start/duration/end ', () => {
    const clip = new FFClip({});
    clip.parent = { start: 0, duration: 10 }
    expect(clip.start).toBe(0);
    expect(clip.duration).toBe(10);
    expect(clip.end).toBe(10);

    clip.prevSibling = { end: 3 };
    expect(clip.start).toBe(3);
    expect(clip.duration).toBe(7);
    expect(clip.end).toBe(10);
  });

  test('clip: start change', () => {
    let clip = new FFClip({ start: 1});
    clip.parent = { start: 0, duration: 10 }
    expect(clip.start).toBe(1);
    expect(clip.duration).toBe(9);
    expect(clip.end).toBe(10);

    clip.conf.start = -3;
    expect(clip.start).toBe(7);
    expect(clip.duration).toBe(3);
    expect(clip.end).toBe(10);

    clip.conf.start = 7;
    expect(clip.start).toBe(7);
    expect(clip.duration).toBe(3);
    expect(clip.end).toBe(10);

    clip.conf.start = 11;
    expect(clip.start).toBe(11);
    expect(clip.duration).toBe(1);
    expect(clip.end).toBe(12);

    clip.conf.start = "100%";
    expect(clip.start).toBe(10);
    expect(clip.duration).toBe(1);
    expect(clip.end).toBe(11);

    clip.conf.start = "45%";
    expect(clip.start).toBe(4.5);
    expect(clip.duration).toBe(5.5);
    expect(clip.end).toBe(10);

    clip.conf.start = "-45%";
    expect(clip.start).toBe(5.5);
    expect(clip.duration).toBe(4.5);
    expect(clip.end).toBe(10);
  });

  test('clip: duration change', () => {
    const clip = new FFClip({ duration: 3});
    clip.parent = { start: 0, duration: 10 }
    expect(clip.start).toBe(0);
    expect(clip.duration).toBe(3);
    expect(clip.end).toBe(3);

    clip.conf.duration = 13;
    expect(clip.duration).toBe(13);
    expect(clip.end).toBe(13);

    clip.conf.duration = "150%";
    expect(clip.duration).toBe(15);
    expect(clip.end).toBe(15);
  });

  test('clip: end change', () => {
    const clip = new FFClip({ end: 3});
    clip.parent = { start: 0, duration: 10 }
    expect(clip.start).toBe(0);
    expect(clip.duration).toBe(3);
    expect(clip.end).toBe(3);

    clip.conf.end = 13;
    expect(clip.duration).toBe(13);
    expect(clip.end).toBe(13);

    clip.conf.end = "150%";
    expect(clip.duration).toBe(15);
    expect(clip.end).toBe(15);

    clip.conf.end = "-3";
    expect(clip.duration).toBe(7);
    expect(clip.end).toBe(7);

    clip.conf.end = "-60%";
    expect(clip.duration).toBe(4);
    expect(clip.end).toBe(4);

    // use end only
    clip.conf.duration = "60%";
    clip.conf.end = "-60%";
    expect(clip.duration).toBe(4);
    expect(clip.end).toBe(4);
  });
});
