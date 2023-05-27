import { makeEvent } from "../src/Event/Factory.js";
import { EventToRecord } from "../src/Event/Record.js";
import { Event } from "../src/index.js";
import { makeReducer } from "../src/Reducer.js";

export type State = {
  title: string;
  members: string[];
};

/*
 |--------------------------------------------------------------------------------
 | Reducer
 |--------------------------------------------------------------------------------
 */

export const reducer = makeReducer<State, FooEvent>(
  (state, event) => {
    switch (event.type) {
      case "FooCreated": {
        return {
          title: event.data.title,
          members: []
        };
      }
      case "FooMemberAdded": {
        return {
          ...state,
          members: [...state.members, event.data.name]
        };
      }
    }
  },
  {
    title: ""
  }
);

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: makeEvent<Created>("FooCreated"),
  member: {
    added: makeEvent<MemberAdded>("FooMemberAdded")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type Created = Event<"FooCreated", { title: string }>;
export type MemberAdded = Event<"FooMemberAdded", { name: string }>;

/*
 |--------------------------------------------------------------------------------
 | Event Union
 |--------------------------------------------------------------------------------
 */

export type FooEvent = EventToRecord<Created | MemberAdded>;
