import { insert } from "./Insert";
import { remove } from "./Remove";
import { replace } from "./Replace";
import { update } from "./Update";

export const operations = {
  insert,
  update,
  replace,
  delete: remove
};
