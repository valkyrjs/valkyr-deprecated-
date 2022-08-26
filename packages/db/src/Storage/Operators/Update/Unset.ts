import { dot } from "../../../Dot";
import { Document } from "../../Storage";
import type { Update } from "../Operators";

export function $unset(document: Document, $unset: Update["operators"]["$unset"] = {}): boolean {
  let modified = false;
  for (const key in $unset) {
    if (dot.deleteProperty(document, key)) {
      modified = true;
    }
  }
  return modified;
}
