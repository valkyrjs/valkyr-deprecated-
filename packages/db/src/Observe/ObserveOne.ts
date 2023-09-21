import { Collection } from "../Collection.js";
import { Document, Filter, WithId } from "../Types.js";
import { isMatch } from "./IsMatch.js";

export function observeOne<TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  filter: Filter<WithId<TSchema>>,
  onChange: (document: Document | undefined) => void
): {
  unsubscribe: () => void;
} {
  collection.findOne(filter).then(onChange);

  const subscription = collection.observable.change.subscribe(({ type, data }) => {
    switch (type) {
      case "insertOne":
      case "updateOne": {
        if (isMatch<TSchema>(data, filter) === true) {
          onChange(data);
        }
        break;
      }
      case "remove": {
        for (const document of data) {
          if (isMatch<TSchema>(document, filter) === true) {
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
