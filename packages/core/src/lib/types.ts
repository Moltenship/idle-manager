const IDLE_EVENT_NAME = 'idle' as const;
const ACTIVE_EVENT_NAME = 'active' as const;

type Idle = typeof IDLE_EVENT_NAME;
type Active = typeof ACTIVE_EVENT_NAME;

export type State = Idle | Active;

export type BrowserEvent = keyof DocumentEventMap;

export interface Options {
  /** What events should define if user is active. */
  readonly activeEvents?: BrowserEvent[];
  /** Time to consider user as `idle`. */
  readonly timeToIdleMs?: number;
  /** List of events to ignore being `active`. */
  readonly ignoredEvents?: BrowserEvent[];
}

export type OnFn = (eventName: State, cb: () => void) => () => void;
export type OffFn = () => void;


