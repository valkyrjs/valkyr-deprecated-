import { createReducer, LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "../src";

export type State = {
  title: string;
  members: string[];
};

/*
 |--------------------------------------------------------------------------------
 | Reducer
 |--------------------------------------------------------------------------------
 */

export const reducer = createReducer<State, EventRecord>(
  {
    title: "",
    members: []
  },
  (state, event) => {
    switch (event.type) {
      case "FooCreated": {
        return {
          ...state,
          title: event.data.title
        };
      }
      case "FooMemberAdded": {
        return {
          ...state,
          members: [...state.members, event.data.name]
        };
      }
    }
  }
);

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: makeEventFactory<Created>("FooCreated"),
  member: {
    added: makeEventFactory<MemberAdded>("FooMemberAdded")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"FooCreated", { title: string }, never>;
export type MemberAdded = LedgerEvent<"FooMemberAdded", { name: string }, never>;

/*
 |--------------------------------------------------------------------------------
 | Event Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | MemberAdded;

export type EventRecord = LedgerEventToLedgerRecord<Event>;
