import { clone } from "../../../Clone.js";
import { Document, Filter, UpdateFilter, WithId } from "../../../Types.js";
import { $inc } from "./Inc.js";
import { $pull } from "./Pull.js";
import { $push } from "./Push.js";
import { $set } from "./Set.js";
import { $unset } from "./Unset.js";

export function update<TSchema extends Document>(
  filter: Filter<WithId<TSchema>>,
  operators: UpdateFilter<TSchema>,
  document: WithId<TSchema>
) {
  const updatedDocument = clone(document);

  const setModified = $set<TSchema>(updatedDocument, filter, operators.$set);
  const runModified = $unset<TSchema>(updatedDocument, operators.$unset);
  const pushModified = $push<TSchema>(updatedDocument, operators.$push);
  const pullModified = $pull<TSchema>(updatedDocument, operators.$pull);
  const incModified = $inc<TSchema>(updatedDocument, filter, operators.$inc);

  return {
    modified: setModified || runModified || pushModified || pullModified || incModified,
    document: updatedDocument
  };
}
