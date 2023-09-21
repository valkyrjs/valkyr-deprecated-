import { Query } from "mingo";

import { Collection } from "../Collection.js";
import { addOptions, ChangeEvent, Options } from "../Storage/mod.js";
import { Document, Filter, WithId } from "../Types.js";
import { Store } from "./Store.js";

export function observe<TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  filter: Filter<WithId<TSchema>>,
  options: Options | undefined,
  onChange: (documents: WithId<TSchema>[], changed: WithId<TSchema>[], type: ChangeEvent<TSchema>["type"]) => void
): {
  unsubscribe: () => void;
} {
  const store = Store.create<TSchema>();

  let debounce: NodeJS.Timeout;

  collection.find(filter, options).then(async (documents) => {
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
      let changed: WithId<TSchema>[] = [];
      switch (type) {
        case "insertOne":
        case "updateOne": {
          changed = await store[type](data, filter);
          break;
        }
        case "insertMany":
        case "updateMany":
        case "remove": {
          changed = await store[type](data, filter);
          break;
        }
      }
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

function applyQueryOptions<TSchema extends Document = Document>(
  documents: WithId<TSchema>[],
  options?: Options
): WithId<TSchema>[] {
  if (options !== undefined) {
    return addOptions(new Query({}).find(documents), options).all() as WithId<TSchema>[];
  }
  return documents;
}
