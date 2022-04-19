/* eslint-disable @typescript-eslint/ban-types */

import { Collection as DbCollection, IndexedDbAdapter } from "@valkyr/db";

export const COLLECTION_WATERMARK = "__collection__";
export const COLLECTION_NAME = "collection:name";

const adapter = new IndexedDbAdapter();

export function Collection(name: string): ClassDecorator {
  return function <TFunction extends Function>(constructor: TFunction): void | TFunction {
    Reflect.defineMetadata(COLLECTION_WATERMARK, true, constructor);
    Reflect.defineMetadata(COLLECTION_NAME, name, constructor);
    (constructor as any).$collection = new DbCollection(name, adapter);
  };
}
