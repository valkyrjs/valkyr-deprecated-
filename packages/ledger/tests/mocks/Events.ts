import { LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "../../src/Event";

export type FooCreated = LedgerEvent<"FooCreated", { title: string }, never>;
export type FooMemberAdded = LedgerEvent<"FooMemberAdded", { name: string }, never>;

export const foo = {
  created: makeEventFactory<FooCreated>("FooCreated"),
  memberAdded: makeEventFactory<FooMemberAdded>("FooMemberAdded")
};

export type Event = FooCreated | FooMemberAdded;

export type EventRecord = LedgerEventToLedgerRecord<Event>;
