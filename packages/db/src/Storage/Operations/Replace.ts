import { Storage } from "../Storage";
import { Replace } from "../Types";
import { UpdateOneResult } from "./Update";
import { clone } from "./Utils/Clone";

export function replace(storage: Storage, operation: Replace): UpdateOneResult {
  storage.documents.set(operation.document.id, clone(operation.document));
  storage.emit("change", "update", operation.document);
  return new UpdateOneResult(true, true);
}
