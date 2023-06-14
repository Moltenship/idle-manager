import { BrowserEvent, OffFn, OnFn, Options, State } from "./types";

export const DEFAULT_ACTIVE_EVENTS = [
  'click',
  'touchstart',
  'touchend',
  'touchend',
  'mousemove',
  'keydown',
  'focus',
  'scroll',
  'visibilitychange'
] satisfies BrowserEvent[];


export const DEFAULT_OPTIONS: Options = {
  activeEvents: DEFAULT_ACTIVE_EVENTS,
  timeToIdleMs: 5000,
  ignoredEvents: [] as BrowserEvent[],
  initialState: 'active',
}


/**
 * Creates idle manager.
 * @params options List of options.
 */
export function idleManager({
  activeEvents = DEFAULT_ACTIVE_EVENTS,
  timeToIdleMs = 5000,
  ignoredEvents = [],
  initialState = 'active'
} = DEFAULT_OPTIONS) {
  let timeoutId: number;
  let state: State = 'active'
  const userListeners = new Map<State, Set<() => void>>([
    ['active', new Set()],
    ['idle', new Set()],
  ]);

  const setState = (newState: State) => {
    clearTimeout(timeoutId);

    if (newState === 'active') {
      timeoutId = setTimeout(() => {
        setState('idle');
      }, timeToIdleMs) as unknown as number;
    }

    if (state !== newState) {
      state = newState;
      userListeners.get(state)?.forEach(cb => cb());
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      setState('idle');
    } else {
      setState('active');
    }
  }

  const handleActiveEvent = () => {
    console.log('tetetete')
    setState('active');
  };

  /** Inits idle manager. */
  const init = () => {
    setState(initialState);
    activeEvents.filter(eventName => !ignoredEvents.includes(eventName)).forEach(eventName => {
      if (eventName === 'visibilitychange') {
        document.addEventListener(eventName, handleVisibilityChange);
      } else {
        document.addEventListener(eventName, handleActiveEvent);
      }
    });
  };

  /**
   * Subscribes to a given `state` change.
   * @param eventName Event name to subscribe to.
   * @param cb Callback to be called when event is triggered.
   * @returns A callback to unsubscribe from an event.
   *
   * **Note:** To prevent memory leaks make sure to unsubscribe from an event/idle manager.
   */
  const on: OnFn = (eventName, cb) => {
    userListeners.get(eventName)?.add(cb);
    const off = () => {
      userListeners.get(eventName)?.delete(cb);
    }
    return off;
  }

  /** Disables idle manager and unsubscribes from all events. */
  const off: OffFn = () => {
    clearTimeout(timeoutId);
    activeEvents.forEach(eventName => {
      document.removeEventListener(eventName, handleActiveEvent);
    });
    userListeners.get('active')?.clear();
    userListeners.get('idle')?.clear();
    userListeners.clear();
  };

  init();

  return {
    on, off
  };
}
