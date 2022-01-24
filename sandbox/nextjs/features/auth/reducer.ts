import type { Dispatch } from "react";

export type AuthDispatch = Dispatch<Action>;

export type State =
  | {
      step: "email" | "pin";
      email?: string;
    }
  | {
      step: "email";
      email: undefined;
    }
  | {
      step: "pin";
      email: string;
    };

type Action =
  | {
      type: "SHOW_EMAIL";
    }
  | {
      type: "SHOW_PIN";
      email: string;
    };

export const defaultState = Object.freeze<State>({ step: "email" });

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SHOW_EMAIL": {
      return {
        ...state,
        step: "email"
      };
    }
    case "SHOW_PIN": {
      return {
        ...state,
        step: "pin",
        email: action.email
      };
    }
  }
}
