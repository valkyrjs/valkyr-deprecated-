import { RawObject } from "mingo/types";

export type Adapter<D extends Document = any> = {
  type: string;
  set(name: string, documents: D[]): Promise<void>;
  get(name: string): Promise<D[]>;
  del(name: string): Promise<void>;
  flush(): void;
};

export type Document = {
  id: string;
};

export type Status = "loading" | "ready" | "working";

export type ChangeType = "insert" | "update" | "delete";

export type Operation<D extends Document = any> = Insert<D> | Update | Replace<D> | Delete;

export type Insert<D extends Document = any> = {
  type: "insert";
  document: D & {
    id?: string;
  };
} & OperationPromise<string>;

export type Update = {
  type: "update";
  id: string;
  criteria: RawObject;
  actions: UpdateActions;
} & OperationPromise;

export type Replace<D extends Document = any> = {
  type: "replace";
  id: string;
  document: D;
} & OperationPromise;

export type Delete = {
  type: "delete";
  id: string;
} & OperationPromise;

export type OperationPromise<T = any> = {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
};

export type InsertOneResponse = {
  acknowledged: boolean;
  insertedId: string;
};

export type InsertManyResponse = {
  acknowledged: boolean;
  insertedIds: string[];
};

export type UpdateResponse = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
};

export type DeleteResponse = {
  acknowledged: boolean;
  deletedCount: number;
};

export type UpdateActions = {
  $set?: Record<string, unknown>;
  $unset?: Record<string, unknown>;
  $push?: Record<string, unknown>;
  $pull?: Record<string, unknown>;
};
