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
    eventer.on('hello', str => {
      expect(str).toBe('world');
    });
    eventer.emit({ type: 'hello' }, 'world');
  });

  test('emitError: should called target.emit', () => {
    eventer.on('error', error => {
      console.log(error);
      expect(error).toBe('world');
    });
    eventer.emitError({ pos: 'here', error: new Error('here error') });
  });

  test('destroy: target should be null', () => {
    expect(eventer.removeAllListeners).toHaveBeenCalled();
    eventer.destroy();
  });
});
