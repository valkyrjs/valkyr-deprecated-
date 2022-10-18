import type { RawObject } from "mingo/types";

import { clone } from "../../../Clone";
import { DocumentNotFoundError } from "../../Errors";
import { Document, Storage } from "../../Storage";
import { Update } from "../Operators";
import { UpdateOneException } from "./Exceptions";
import { $pull } from "./Pull";
import { $push } from "./Push";
import { UpdateOneResult } from "./Result";
import { $set } from "./Set";
import { $unset } from "./Unset";

export function update(storage: Storage, operator: Update): UpdateOneResult | UpdateOneException {
  try {
    const { id, criteria, operators } = operator;

    const currentDocument = storage.documents.get(id);
    if (currentDocument === undefined) {
      return new UpdateOneException(false, new DocumentNotFoundError(criteria));
    }

    const { modified, document } = execute(criteria, operators, clone(currentDocument));

    storage.commit("update", document);

    return new UpdateOneResult(true, modified);
  } catch (error) {
    return new UpdateOneException(true, error);
  }
}

function execute(criteria: RawObject, operators: Update["operators"], document: Document) {
  const updatedDocument = clone(document);

  const setModified = $set(updatedDocument, criteria, operators.$set);
  const runModified = $unset(updatedDocument, operators.$unset);
  const pushModified = $push(updatedDocument, operators.$push);
  const pullModified = $pull(updatedDocument, operators.$pull);

  return {
    modified: setModified || runModified || pushModified || pullModified,
    document: updatedDocument
  };
}
