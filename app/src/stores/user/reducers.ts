import { makeReducer } from "@valkyr/ledger";

import { UserEvent } from "./events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type UserState = {
  name: string;
  email: string;
};

/*
 |--------------------------------------------------------------------------------
 | Reducer
 |--------------------------------------------------------------------------------
 */

export const userReducer = makeReducer<UserState, UserEvent>(
  (state, event) => {
    switch (event.type) {
      case "UserCreated": {
        return {
          name: event.data.name,
          email: event.data.email
        };
      }
      default: {
        return state;
      }
    }
  },
  {
    name: "",
    email: ""
  }
);
