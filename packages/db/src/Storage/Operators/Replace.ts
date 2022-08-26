import { clone } from "../../Clone";
import { Storage } from "../Storage";
import { Replace } from "./Operators";
import { UpdateOneResult } from "./Update";

export function replace(storage: Storage, operator: Replace): UpdateOneResult {
  storage.documents.set(operator.document.id, clone(operator.document));
  storage.emit("change", "update", operator.document);
  return new UpdateOneResult(true, true);
}
