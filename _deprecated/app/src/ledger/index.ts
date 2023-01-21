import { cursor } from "./cursor";
import { db } from "./database";
import { pull } from "./pull";
import { queue } from "./queue";
import { store } from "./store";

export const ledger = {
  db,
  push: store.push,
  insert: store.insert,
  validator: store.validator,
  projector: store.projector,
  validate: store.validate,
  project: store.project,
  pull,
  cursor,
  queue
};
