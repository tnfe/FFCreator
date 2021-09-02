const FFEventer = require('@/event/eventer');

describe('event/eventer', () => {
  let eventer = null;

  test('create eventer instance', () => {
    eventer = new FFEventer();
    expect(eventer).toBeInstanceOf(FFEventer);
  });

  test('emitProgress: should called target.emit', () => {
    eventer.emitProgress({});
    expect(eventer.progressEvent).not.toBeNull();
  });

  test('emit: should called target.emit', () => {
    eventer.on('hello', obj => {
      expect(obj.key).toBe('world');
    });
    eventer.emit('hello', { key: 'world' });
  });

  test('emitError: should called target.emit', () => {
    eventer.on('error', error => {
      expect(error.error).toBe('a js error');
    });
    eventer.emitError({ pos: 'here', error: new Error('a js error') });
  });

  test('destroy: target should be null', () => {
    eventer.removeAllListeners = jest.fn();
    eventer.destroy();
    expect(eventer.removeAllListeners).toHaveBeenCalled();
  });
});
