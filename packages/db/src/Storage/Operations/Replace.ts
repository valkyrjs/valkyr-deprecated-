import { clone } from "@valkyr/utils";

import { Storage } from "../Storage";
import { Replace } from "../Types";

export function replace(storage: Storage, operation: Replace): boolean {
  storage.documents.set(operation.document.id, clone(operation.document));
  storage.emit("change", "update", operation.document);
  return true;
}
