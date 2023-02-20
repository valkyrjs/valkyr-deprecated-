import { Collection } from "../Collection.js";
import type { Document } from "../Storage/mod.js";
import { Criteria, isMatch } from "./IsMatch.js";

export function observeOne(
  collection: Collection,
  criteria: Criteria,
  onChange: (document: Document | undefined) => void
): {
  unsubscribe: () => void;
} {
  collection.findOne(criteria).then(onChange);

  const subscription = collection.observable.change.subscribe(({ type, data }) => {
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

  return {
    unsubscribe: () => {
      subscription.unsubscribe();
    }
  };
}
