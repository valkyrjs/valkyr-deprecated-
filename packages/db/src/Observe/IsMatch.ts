import { Query } from "mingo";

import { Document, Filter, WithId } from "../Types.js";

export function isMatch<TSchema extends Document = Document>(
  document: WithId<TSchema>,
  filter?: Filter<WithId<TSchema>>
): boolean {
  return !filter || new Query(filter).test(document);
}
