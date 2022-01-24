import { createEvent, Event as EventBase } from "../../src/Event";

export type FooCreated = EventBase<"FooCreated", { title: string }, never>;
export type FooMemberAdded = EventBase<"FooMemberAdded", { name: string }, never>;

export const foo = {
  created: createEvent<FooCreated>("FooCreated"),
  memberAdded: createEvent<FooMemberAdded>("FooMemberAdded")
};

export type Event = FooCreated | FooMemberAdded;
