const tween = require('@/animate/tween');

jest.mock('@tweenjs/tween.js', () => ({
  Tween: jest.fn(function() {
    this.to = jest.fn(function() {
      return this;
    });
    this.delay = jest.fn(function() {
      return this;
    });
    this.easing = jest.fn(function() {
      return this;
    });
    this.onUpdate = jest.fn(function() {
      return this;
    });
    this.start = jest.fn(function() {
      return this;
    });
  }),
}));

describe('animate/tween', () => {
  let target = {};
  beforeEach(() => {
    target = {
      animations: [],
      display: {},
      attr: jest.fn(() => {}),
      addAnimate: jest.fn(function(obj) {
        this.animations.push(obj);
      }),
      root: () => { return { tweenGroup: '1' } }
    };
  });
  test('from: should add from animation', () => {
    tween.from(target, 10, { delay: 5, ease: 'ease' });
    const ani = target.animations.pop();
    expect(ani).toMatchObject({ from: target.display, to: {}, time: 10, delay: 5, ease: 'ease' });
  });

  test('to: should add to animation', () => {
    tween.to(target, 10, { delay: 5, ease: 'ease' });
    const ani = target.animations.pop();
    expect(ani).toMatchObject({ from: target.display, to: {}, time: 10, delay: 5, ease: 'ease' });
  });

  test('fromTo: should add fromTo animation', () => {
    const time = 10;
    const delay = 5;
    const ease = 'ease';
    const formObj = {};
    const toObj = { delay: delay + 1, ease };
    tween.fromTo(target, time, formObj, toObj);
    const ani = target.animations.pop();
    expect(ani).toMatchObject({ from: {}, to: {}, time, delay: delay + 1, ease });
  });

  test('spriteTweenFromTo: invoking tween function success', () => {
    const time = 10;
    const delay = 5;
    const ease = 'ease';
    const formObj = {};
    const toObj = { delay: delay + 1, ease };
    const instance = tween.spriteTweenFromTo(target, time, formObj, toObj);

    expect(instance.to).toBeCalledTimes(1);
    expect(instance.delay).toBeCalledTimes(1);
    expect(instance.easing).toBeCalledTimes(1);
    expect(instance.onUpdate).toBeCalledTimes(1);
    expect(instance.start).toBeCalledTimes(1);
  });
});
