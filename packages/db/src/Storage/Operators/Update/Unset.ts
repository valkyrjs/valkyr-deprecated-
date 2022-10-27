import { dot } from "../../../Dot";
import { Document } from "../../Storage";
import type { UpdateOperators } from "./Update";

export function $unset(document: Document, $unset: UpdateOperators["$unset"] = {}): boolean {
  let modified = false;
  for (const key in $unset) {
    if (dot.deleteProperty(document, key)) {
      modified = true;
    }
  }
  return modified;
}
