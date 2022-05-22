import { createReducer } from "../../src/Reducer";
import type { EventRecord } from "./Events";

type State = {
  title: string;
  members: string[];
};

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
