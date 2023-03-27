import * as dot from "dot-prop";

import { Document } from "../../Storage.js";
import type { UpdateOperators } from "./Update.js";

export function $unset(document: Document, $unset: UpdateOperators["$unset"] = {}): boolean {
  let modified = false;
  for (const key in $unset) {
    if (dot.deleteProperty(document, key)) {
      modified = true;
    }
  }
  return modified;
}
