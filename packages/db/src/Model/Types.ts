import type { Collection } from "../Collection";
import type { Model } from "./Model";

export type ModelClass<T extends Model = Model> = {
  new (document: any): T;
  $name: string;
  $collection: Collection;
};
