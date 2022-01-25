import { useReducer } from "react";

import { AuthDispatch, defaultState, reducer, State } from "../../Reducers/Auth";

export function useAuth(): [State, { dispatch: AuthDispatch }] {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return [
    state,
    {
      dispatch
    }
  ];
}
