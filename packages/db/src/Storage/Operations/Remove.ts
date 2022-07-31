import { Storage } from "../Storage";
import { Delete } from "../Types";

export function remove(storage: Storage, operation: Delete): boolean {
  if (storage.documents.has(operation.id) === false) {
    return false;
  }
  storage.documents.delete(operation.id);
  storage.emit("change", "delete", { id: operation.id });
  return true;
}
