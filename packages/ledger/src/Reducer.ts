import type { Event } from "./Event";

/*
 |--------------------------------------------------------------------------------
 | Reducer
 |--------------------------------------------------------------------------------
 */

export function createReducer<State, E extends Event>(state: State = {} as State, reducer: Reducer<State, E>) {
  return function (events: E[]): State {
    return events.reduce(reducer, { ...state });
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Reducer<State, E extends Event> = (state: State, event: E) => State;

export type ReduceHandler<State = any, E extends Event = any> = (events: E[]) => State;
