import { Collection } from "../collection";
import type { Document } from "../storage";
import { Criteria, isMatch } from "./is-match";

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
      case "remove": {
        if (isMatch(document, criteria) === true) {
          onChange(undefined);
        }
        break;
      }
    }
  });
}
