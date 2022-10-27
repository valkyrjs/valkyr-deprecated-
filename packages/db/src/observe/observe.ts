import { Query } from "mingo";

import { Collection } from "../collection";
import { addOptions, Document, Options } from "../storage";
import { Criteria } from "./is-match";
import { Store } from "./store";

export function observe(
  collection: Collection,
  criteria: Criteria,
  options: Options | undefined,
  onChange: (documents: Document[]) => void
): {
  unsubscribe: () => void;
} {
  const store = Store.create("CollectionObserver");

  let debounce: NodeJS.Timeout;

  collection.find(criteria, options).then(async (documents) => {
    onChange(await store.resolve(documents));
  });

  return {
    unsubscribe: collection.storage.onChange(async (type, document) => {
      const hasChanged = await store[type](document, criteria);
      if (hasChanged === true) {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          store.getDocuments().then((documents) => {
            onChange(toQueriedData(documents, options));
          });
        }, 0);
      }
    })
  };
}

function toQueriedData(documents: Document[], options?: Options): Document[] {
  if (options !== undefined) {
    return addOptions(new Query({}).find(documents), options).all() as Document[];
  }
  return documents;
}
