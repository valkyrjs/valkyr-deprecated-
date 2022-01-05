export type Action<T = unknown> =
  | {
      type: "insert";
      instance: T;
    }
  | {
      type: "update";
      instance: T;
    }
  | {
      type: "delete";
      instance: T;
    };
