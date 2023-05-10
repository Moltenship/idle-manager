import {idleManager} from './idleManager';
import { BrowserEvent } from './types';

const fireEvent = (eventName: BrowserEvent, target = document) => {
  const event = new Event(eventName, { bubbles: true, cancelable: true });
  document.dispatchEvent(event);
}

describe('Idle manager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('fires cb on idle state', () => {
    const cb = vi.fn(() => {});

    const manager = idleManager();
    manager.on('idle', cb);
    vi.runAllTimers()

    expect(cb).toBeCalledTimes(1);
    manager.off();
  });

  it('fires several cbs on idle state', () => {
    const cb = vi.fn(() => {});
    const cb1 = vi.fn(() => {});

    const manager = idleManager();
    manager.on('idle', cb);
    manager.on('idle', cb1);

    vi.runAllTimers()

    expect(cb).toBeCalledTimes(1);
    expect(cb1).toBeCalledTimes(1);

    manager.off();
  });

  it('fires cb on idle state after certain time', () => {
    const timeMs = 10000
    const cb = vi.fn(() => {});

    const manager = idleManager({timeToIdleMs: timeMs});
    manager.on('idle', cb);

    vi.advanceTimersByTime(timeMs);
    expect(cb).toBeCalledTimes(1);

    manager.off();
  });


  it('fires cb active state', () => {
    const cb = vi.fn(() => {});

    const manager = idleManager({initialState: 'idle'});
    manager.on('active', cb);
    fireEvent('mousemove');

    expect(cb).toBeCalledTimes(1);
    manager.off();
  });

  it('fires several callbacks on active state', () => {
    const cb = vi.fn(() => {});
    const cb1 = vi.fn(() => {});

    const manager = idleManager({initialState: 'idle'});
    manager.on('active', cb);
    manager.on('active', cb1);

    fireEvent('mousemove');

    expect(cb).toBeCalledTimes(1);
    expect(cb1).toBeCalledTimes(1);

    manager.off();
  });

  it('doesn\'t fire same cb in two subscriptions', () => {
    const cb = vi.fn(() => {});

    const manager = idleManager({initialState: 'idle'});
    manager.on('active', cb);
    manager.on('active', cb);

    fireEvent('mousemove');

    expect(cb).toBeCalledTimes(1);

    manager.off();
  });

  it('doesn\'t fire cb after unsubscribe', () => {
    const cb = vi.fn(() => {});

    const manager = idleManager();
    const off = manager.on('idle', cb);
    off();
    vi.runAllTimers();

    expect(cb).toBeCalledTimes(0);
    manager.off();
  });

  it('doesn\'t fire cb after unsubscribing from the manager', () => {
    const cb = vi.fn(() => {});

    const manager = idleManager();
    manager.on('idle', cb);
    manager.off();
    vi.runAllTimers();

    expect(cb).toBeCalledTimes(0);
  });

  it('doesn\'t fire callback after subscribing if state is active', () => {
    const cb = vi.fn(() => {});
    const cb1 = vi.fn(() => {});

    const manager = idleManager({initialState: 'idle'});
    manager.on('active', cb);
    fireEvent('mousemove');
    manager.on('active', cb1);
    fireEvent('mousemove');

    expect(cb).toBeCalledTimes(1);
    expect(cb1).toBeCalledTimes(0);

    manager.off();
  });

  it('fires a cb after active state', () => {
    const cb = vi.fn(() => {});


    const manager = idleManager({initialState: 'idle'});
    manager.on('idle', cb);
    fireEvent('mousemove');
    vi.runAllTimers();

    expect(cb).toBeCalledTimes(1);
    manager.off();
  });

  it('ignored events doesn\'t trigger state change', () => {
    const cb = vi.fn(() => {});

    const manager = idleManager({initialState: 'idle', ignoredEvents: ['mousemove']});
    manager.on('active', cb);
    fireEvent('mousemove');

    expect(cb).toBeCalledTimes(0);
    manager.off();
  });
});
