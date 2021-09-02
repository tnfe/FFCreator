const Event = require('@/event/event');

describe('event/event', () => {
  let event = null;
  test('create event instance', () => {
    event = new Event({ percent: 1 });
    expect(event).toBeInstanceOf(Event);
    expect(event.percent).toBe(1);
  });
});
