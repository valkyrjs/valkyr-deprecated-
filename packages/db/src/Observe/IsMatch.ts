import { Query } from "mingo";
import { RawObject } from "mingo/types";

import { Document } from "../Storage/mod.js";

export type Criteria = RawObject | undefined;

export function isMatch(document: Document, criteria: Criteria): boolean {
  return !criteria || new Query(criteria).test(document);
}
