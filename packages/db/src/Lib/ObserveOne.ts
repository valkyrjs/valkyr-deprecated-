import { Query } from "mingo";
import { RawObject } from "mingo/types";

import type { Document } from "../Types/Storage";
import { Collection } from "./Collection";

export function observeOne(
  collection: Collection,
  criteria: RawObject | undefined,
  cb: (document: Document | undefined) => void
): () => void {
  collection.findOne(criteria).then(cb);
  return collection.storage.onChange((type, document) => {
    switch (type) {
      case "insert":
      case "update": {
        if (!criteria || new Query(criteria).test(document)) {
          cb(document);
        }
        break;
      }
      case "delete": {
        if (!criteria || new Query(criteria).test(document)) {
          cb(undefined);
        }
        break;
      }
    }
  });
}
