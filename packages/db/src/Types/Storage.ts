export type Adapter = {
  set(name: string, documents: Document[]): Promise<void>;
  get(name: string): Promise<Document[]>;
  del(name: string): Promise<void>;
};

export type Document = {
  id: string;
};

export type Status = "loading" | "ready" | "working";

export type ChangeType = "insert" | "update" | "delete";

export type Operation = Insert | Update | Upsert | Delete;

export type Insert = {
  type: "insert";
  document: {
    id?: string;
    [key: string]: unknown;
  };
} & OperationPromise;

export type Update = {
  type: "update";
  document: Document;
} & OperationPromise;

export type Upsert = {
  type: "upsert";
  document: Document;
} & OperationPromise;

export type Delete = {
  type: "delete";
  id: string;
} & OperationDeletePromise;

export type OperationPromise = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

export type OperationDeletePromise = {
  resolve: () => void;
  reject: (reason?: any) => void;
};
