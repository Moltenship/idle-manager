# IdleManager

Idle manager allows you track whether user is active or idle

```ts
import { idleManager } from '@idle-manager/core';

const manager = idleManager({/** your options **/});
manager.on('idle', () => {
  console.log('idle');
});

manager.on('active', () => {
  console.log('active');
});

// Don't forget to unsubscribe 🙃
manager.off();
```

## API

`idleManager` function takes an object with options:

* `activeEvents` - list of events that make user `active`. Default: `['click' 'touchstart', 'touchend', 'touchend', 'mousemove', 'keydown', 'focus', 'scroll', 'visibilitychange']`

* `timeToIdleMs` - time in milliseconds to consider user is idle if events are not fired. Default: `5000`

* `initialState` - initial state of the manager. Default: `active`

* `ignoredEvents` - list of events that should be ignored. Default: `[]`

`on` function returns a function to unsubscribe from listening `idle`/`active` state changes.

**Note**: returned function doesn't unsubscribe from `DOM` events, you have to do it through `off` function from `idleManager`. This function unsubscribe current handler from listening changes.

`off` function unsubscribes from all events and stops `idleManager`

React example:

```tsx
import { idleManager } from '@idle-manager/core';

useEffect(() => {
  const manager = idleManager({/** your options **/});
  manager.on('idle', () => {
    console.log('idle');
  });

  manager.on('active', () => {
    console.log('active');
  });

  return () => {
    manager.off();
  }
}, []);
```
