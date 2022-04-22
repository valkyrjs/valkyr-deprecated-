export type Adapter = {
  set(name: string, documents: Document[]): Promise<void>;
  get(name: string): Promise<Document[]>;
  del(name: string): Promise<void>;
  flush(): void;
};

export type Document = {
  id: string;
};

export type Status = "loading" | "ready" | "working";

export type ChangeType = "insert" | "update" | "delete";

export type Operation = Insert | Update | Replace | Delete;

export type Insert = {
  type: "insert";
  document: {
    id?: string;
    [key: string]: unknown;
  };
} & OperationPromise<string>;

export type Update = {
  type: "update";
  id: string;
  actions: UpdateActions;
} & OperationPromise;

export type Replace = {
  type: "replace";
  id: string;
  document: Document;
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
