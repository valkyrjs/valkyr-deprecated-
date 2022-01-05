export type State =
  | {
      status: "pending" | "hydrating" | "started";
      loading: boolean;
      error: undefined;
    }
  | {
      status: "pending" | "hydrating";
      loading: true;
      error: undefined;
    }
  | {
      status: "started";
      loading: false;
      error: undefined;
    }
  | {
      status: "error";
      loading: false;
      error: string;
    };

type Action =
  | {
      type: "PENDING";
    }
  | {
      type: "HYDRATING";
    }
  | {
      type: "STARTED";
    }
  | {
      type: "FAILED";
      error: Error;
    };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PENDING": {
      return {
        ...state,
        status: "pending",
        loading: true,
        error: undefined
      };
    }
    case "HYDRATING": {
      return {
        ...state,
        status: "hydrating",
        loading: true,
        error: undefined
      };
    }
    case "STARTED": {
      return {
        ...state,
        status: "started",
        loading: false,
        error: undefined
      };
    }
    case "FAILED": {
      return {
        ...state,
        status: "error",
        loading: false,
        error: action.error.message
      };
    }
  }
}

export function getDefaultState(): State {
  return {
    status: "pending",
    loading: true,
    error: undefined
  };
}
