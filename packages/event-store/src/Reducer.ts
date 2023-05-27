import type { EventRecord } from "./Event/mod.js";

export function makeReducer<S extends {}, E extends EventRecord>(
  reducer: Reducer<S, E>,
  initialState: Partial<S> = {} as Partial<S>
): ReduceHandler<S, E> {
  return (events: E[]) => events.reduce(reducer, initialState as S);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Reducer<S, E extends EventRecord> = (state: S, event: E) => S;

export type ReduceHandler<S = any, E = any> = (events: E[]) => S;
