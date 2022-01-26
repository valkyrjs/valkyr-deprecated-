import { Query } from "mingo";

import { addOptions, Collection, Options } from "../Collection";
import { Document } from "../Storage";
import { Store } from "./Store";
import { Criteria } from "./Utils";

export function observe(
  collection: Collection,
  criteria: Criteria,
  options: Options | undefined,
  onChange: (documents: Document[]) => void
): () => void {
  const store = Store.create();

  collection.find(criteria, options).then(async (documents) => {
    onChange(await store.resolve(documents));
  });

  return collection.storage.onChange(async (type, document) => {
    const hasChanged = await store[type](document, criteria);
    if (hasChanged) {
      onChange(toQueriedData(store.data, options));
    }
  });
}

function toQueriedData(documents: Document[], options?: Options): Document[] {
  if (options) {
    return addOptions(new Query({}).find(documents), options).all() as Document[];
  }
  return documents;
}
