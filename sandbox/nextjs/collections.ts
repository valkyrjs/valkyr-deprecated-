import { Collection as DBCollection } from "@valkyr/db";

import { Account } from "./models/account";
import { Cache } from "./models/cache";
import { Cursor } from "./models/cursor";
import { Event } from "./models/event";
import { adapter } from "./providers/idbAdapter";

export type Collection = keyof typeof collection;

export const collection = {
  accounts: new DBCollection(Account, adapter),
  cache: new DBCollection(Cache, adapter),
  cursors: new DBCollection(Cursor, adapter),
  events: new DBCollection(Event, adapter),
  queue: new DBCollection(Event, adapter)
};
