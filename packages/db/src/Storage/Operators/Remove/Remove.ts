import { DocumentNotFoundError } from "../../Errors";
import { Storage } from "../../Storage";
import { Remove } from "../Operators";
import { RemoveOneException } from "./Exceptions";
import { RemoveOneResult } from "./Result";

export async function remove(storage: Storage, operator: Remove): Promise<RemoveOneResult | RemoveOneException> {
  if ((await storage.hasDocument(operator.id)) === false) {
    return new RemoveOneException(new DocumentNotFoundError({ id: operator.id }));
  }
  storage.commit("remove", { id: operator.id });
  return new RemoveOneResult();
}
