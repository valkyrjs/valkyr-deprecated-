import { Collection as DBCollection } from "@valkyr/db";

import { Account } from "./models/Account";
import { Cache } from "./models/Cache";
import { Cursor } from "./models/Cursor";
import { Event } from "./models/Event";
import { adapter } from "./providers/IdbAdapter";

export type Collection = keyof typeof collection;

export const collection = {
  accounts: new DBCollection(Account, adapter),
  cache: new DBCollection(Cache, adapter),
  cursors: new DBCollection(Cursor, adapter),
  events: new DBCollection(Event, adapter),
  queue: new DBCollection(Event, adapter)
};
