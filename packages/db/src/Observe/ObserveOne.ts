import { Collection } from "../Collection";
import type { Document } from "../Storage";
import { Criteria, isMatch } from "./Utils";

export function observeOne(
  collection: Collection,
  criteria: Criteria,
  onChange: (document: Document | undefined) => void
): () => void {
  collection.findOne(criteria).then(onChange);
  return collection.storage.onChange((type, document) => {
    switch (type) {
      case "insert":
      case "update": {
        if (isMatch(document, criteria) === true) {
          onChange(document);
        }
        break;
      }
      case "delete": {
        if (isMatch(document, criteria) === true) {
          onChange(undefined);
        }
        break;
      }
    }
  });
}
