import type { Document } from "../Storage";

export type AdapterClass<D extends Document> = {
  new (): Adapter<D>;
};

export type Adapter<D extends Document = Document> = {
  type: string;
  set(name: string, documents: D[]): Promise<void>;
  get(name: string): Promise<D[]>;
  del(name: string): Promise<void>;
  flush(): void;
};
