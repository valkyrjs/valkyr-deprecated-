import type { Event } from "../Event";

export type Reducer<State, E extends Event> = (state: State, event: E) => State;

export type ReduceHandler<State = any, E extends Event = any> = (events: E[]) => State;
