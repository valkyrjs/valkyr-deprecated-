import { Query } from "mingo";

import { Collection } from "../Collection.js";
import { addOptions, ChangeEvent, Document, Options } from "../Storage/mod.js";
import { Criteria } from "./IsMatch.js";
import { Store } from "./Store.js";

export function observe(
  collection: Collection,
  criteria: Criteria,
  options: Options | undefined,
  onChange: (documents: Document[], changed: Document[], type: ChangeEvent["type"]) => void
): {
  unsubscribe: () => void;
} {
  const store = Store.create();

  let debounce: NodeJS.Timeout;

  collection.find(criteria, options).then(async (documents) => {
    const resolved = await store.resolve(documents);
    onChange(resolved, resolved, "insertMany");
  });

  const subscriptions = [
    collection.observable.flush.subscribe(() => {
      clearTimeout(debounce);
      store.flush();
      onChange([], [], "remove");
    }),
    collection.observable.change.subscribe(async ({ type, data }) => {
      const changed = await store[type](data, criteria);
      if (changed.length > 0) {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          store.getDocuments().then((documents) => {
            onChange(applyQueryOptions(documents, options), changed, type);
          });
        }, 0);
      }
    })
  ];

  return {
    unsubscribe: () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
      store.destroy();
    }
  };
}

function applyQueryOptions(documents: Document[], options?: Options): Document[] {
  if (options !== undefined) {
    return addOptions(new Query({}).find(documents), options).all() as Document[];
  }
  return documents;
}
