import type { Event } from "../Event";
import type { Reducer } from "./Types";

export function createReducer<State, E extends Event>(state: State = {} as State, reducer: Reducer<State, E>) {
  return function (events: E[]): State {
    return events.reduce(reducer, { ...state });
  };
}
