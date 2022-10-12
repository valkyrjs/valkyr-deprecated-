import { insert } from "./Insert";
import { remove } from "./Remove";
import { replace } from "./Replace";
import { update } from "./Update";

export type { Insert, Operator, Remove, Replace, Update } from "./Operators";

export const operators = {
  insert,
  update,
  replace,
  remove
};
