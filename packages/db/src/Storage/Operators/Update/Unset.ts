import * as dot from "dot-prop";

import { Document, UpdateFilter, WithId } from "../../../Types.js";

export function $unset<TSchema extends Document = Document>(
  document: WithId<TSchema>,
  $unset: UpdateFilter<TSchema>["$unset"] = {}
): boolean {
  let modified = false;
  for (const key in $unset) {
    if (dot.deleteProperty(document, key)) {
      modified = true;
    }
  }
  return modified;
}
