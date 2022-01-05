import type { Model } from "./Model";

export type ModelClass<T extends Model = Model> = {
  new (document: any): T;
  $collection: string;
};
