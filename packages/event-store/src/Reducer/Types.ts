import type { EventBase, EventRecord } from "../Event";

export type Reducer<State, Event extends EventBase> = (state: State, event: EventRecord<Event>) => State;

export type ReduceHandler<State = any, Event extends EventBase = any> = (events: EventRecord<Event>) => State;
