import { Collection } from "../collection";
import type { Document } from "../storage";
import { Criteria, isMatch } from "./is-match";

export function observeOne(
  collection: Collection,
  criteria: Criteria,
  onChange: (document: Document | undefined) => void
): () => void {
  collection.findOne(criteria).then(onChange);
  return collection.storage.onChange((type, data) => {
    switch (type) {
      case "insertOne":
      case "updateOne": {
        if (isMatch(data, criteria) === true) {
          onChange(data);
        }
        break;
      }
      case "remove": {
        for (const document of data) {
          if (isMatch(document, criteria) === true) {
            onChange(undefined);
            break;
          }
        }
        break;
      }
    }
  });
}
