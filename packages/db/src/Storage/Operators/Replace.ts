import { clone } from "../../Clone";
import { Storage } from "../Storage";
import { Replace } from "./Operators";
import { UpdateOneResult } from "./Update";

export async function replace(storage: Storage, operator: Replace): Promise<UpdateOneResult> {
  storage.commit("update", clone(operator.document));
  return new UpdateOneResult(true, true);
}
