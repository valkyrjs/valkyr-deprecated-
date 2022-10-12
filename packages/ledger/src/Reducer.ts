import type { EventRecord } from "./Event";

/*
 |--------------------------------------------------------------------------------
 | Reducer
 |--------------------------------------------------------------------------------
 */

export function createReducer<State, Event extends EventRecord>(
  initialState: State = {} as State,
  reducer: Reducer<State, Event>
): ReduceHandler<State, Event> {
  return function (events: Event[]): State {
    return events.reduce(reducer, { ...initialState });
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Reducer<State, Event extends EventRecord> = (state: State, event: Event) => State;

export type ReduceHandler<State = any, Event extends EventRecord = any> = (events: Event[]) => State;
