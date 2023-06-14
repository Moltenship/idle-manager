import { DEFAULT_ACTIVE_EVENTS, DEFAULT_OPTIONS, idleManager } from "@idle-manager/core";
import { useEffect, useState } from "react";

export const useIdle = ({
  activeEvents = DEFAULT_ACTIVE_EVENTS,
  timeToIdleMs = 5000,
  ignoredEvents = [],
  initialState = 'active'
} = DEFAULT_OPTIONS) => {
  const [isIdle, setIsIdle] = useState(initialState !== 'active');

  useEffect(() => {
    const manager = idleManager({activeEvents, timeToIdleMs, ignoredEvents, initialState});
    manager.on('idle', () => setIsIdle(true));
    manager.on('active', () => setIsIdle(false));

    return () => {
      manager.off();
    };
  }, [setIsIdle, activeEvents, timeToIdleMs, ignoredEvents, initialState]);

  return isIdle;
}
