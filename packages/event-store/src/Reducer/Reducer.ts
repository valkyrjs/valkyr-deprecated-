import type { EventBase, EventRecord } from "../Event";
import type { Reducer } from "./Types";

export function createReducer<State, Event extends EventBase>(
  state: State = {} as State,
  reducer: Reducer<State, Event>
) {
  return function (events: EventRecord<Event>[]): State {
    return events.reduce(reducer, { ...state });
  };
}
