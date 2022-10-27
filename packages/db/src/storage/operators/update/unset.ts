import { dot } from "../../../dot";
import { Document } from "../../storage";
import type { UpdateOperators } from "./update";

export function $unset(document: Document, $unset: UpdateOperators["$unset"] = {}): boolean {
  let modified = false;
  for (const key in $unset) {
    if (dot.deleteProperty(document, key)) {
      modified = true;
    }
  }
  return modified;
}
