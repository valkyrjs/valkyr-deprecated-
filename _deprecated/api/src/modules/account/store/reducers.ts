import { makeReducer } from "@valkyr/ledger";

import { AccountEventRecord } from "./events";

export const accountReducer = makeReducer<State, AccountEventRecord>(
  (state, event) => {
    switch (event.type) {
      case "AccountCreated": {
        return {
          ...state,
          id: event.stream,
          email: event.data.email,
          password: event.data.password
        };
      }
    }
  },
  {
    id: "",
    email: ""
  }
);

type State = {
  id: string;
  email: string;
  password?: string;
  key?: string;
};
