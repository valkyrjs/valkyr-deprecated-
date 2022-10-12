import { DocumentNotFoundError } from "../../Errors";
import { Storage } from "../../Storage";
import { Remove } from "../Operators";
import { RemoveOneException } from "./Exceptions";
import { RemoveOneResult } from "./Result";

export function remove(storage: Storage, operator: Remove): RemoveOneResult | RemoveOneException {
  if (storage.documents.has(operator.id) === false) {
    return new RemoveOneException(new DocumentNotFoundError({ id: operator.id }));
  }
  storage.documents.delete(operator.id);
  storage.emit("change", "remove", { id: operator.id });
  return new RemoveOneResult();
}
