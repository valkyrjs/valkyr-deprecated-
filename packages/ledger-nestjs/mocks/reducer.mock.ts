import { makeReducer } from "@valkyr/ledger";

import { UserEvent } from "./event.mock";

export const userReducer = makeReducer<UserState, UserEvent>((state, event) => {
  switch (event.type) {
    case "UserCreated": {
      return {
        name: event.data.name,
        email: event.data.email
      };
    }
    case "UserNameSet": {
      return {
        ...state,
        name: event.data.name
      };
    }
    case "UserEmailSet": {
      return {
        ...state,
        email: event.data.email
      };
    }
  }
});

type UserState = {
  name: string;
  email: string;
};
