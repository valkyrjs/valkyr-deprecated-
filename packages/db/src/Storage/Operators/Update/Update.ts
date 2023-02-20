import type { RawObject } from "mingo/types.js";

import { clone } from "../../../Clone.js";
import { Document } from "../../Storage.js";
import { $inc } from "./Inc.js";
import { $pull } from "./Pull.js";
import { $push } from "./Push.js";
import { $set } from "./Set.js";
import { $unset } from "./Unset.js";

export function update<D extends Document>(criteria: RawObject, operators: UpdateOperators, document: D) {
  const updatedDocument = clone(document);

  const setModified = $set(updatedDocument, criteria, operators.$set);
  const runModified = $unset(updatedDocument, operators.$unset);
  const pushModified = $push(updatedDocument, operators.$push);
  const pullModified = $pull(updatedDocument, operators.$pull);
  const incModified = $inc(updatedDocument, criteria, operators.$inc);

  return {
    modified: setModified || runModified || pushModified || pullModified || incModified,
    document: updatedDocument
  };
}

export type UpdateOperators = {
  $set?: RawObject;
  $unset?: RawObject;
  $push?: RawObject;
  $pull?: RawObject;
  $inc?: {
    [keyPath: string]: number;
  };
};
