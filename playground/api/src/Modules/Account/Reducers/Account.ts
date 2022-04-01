import { createReducer } from "@valkyr/server";
import type { Account } from "stores";

export const account = createReducer<Account.State, Account.Event>(
  {
    id: "",
    status: "onboarding",
    alias: "",
    name: {
      family: "",
      given: ""
    },
    email: ""
  },
  (state, event) => {
    switch (event.type) {
      case "AccountCreated": {
        return {
          ...state,
          accountId: event.streamId,
          email: event.data.email
        };
      }
      case "AccountActivated": {
        return {
          ...state,
          status: "active"
        };
      }
      case "AccountAliasSet": {
        return {
          ...state,
          alias: event.data.alias
        };
      }
      case "AccountNameSet": {
        return {
          ...state,
          name: event.data.name
        };
      }
      case "AccountEmailSet": {
        return {
          ...state,
          email: event.data.email
        };
      }
      case "AccountClosed": {
        return {
          ...state,
          status: "closed"
        };
      }
    }
  }
);
