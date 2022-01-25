import { Collection as DBCollection } from "@valkyr/db";

import { Account } from "./Models/Account";
import { Cache } from "./Models/Cache";
import { Cursor } from "./Models/Cursor";
import { Event } from "./Models/Event";
import { adapter } from "./Providers/IDBAdapter";

export type Collection = keyof typeof collection;

export const collection = {
  accounts: new DBCollection(Account, adapter),
  cache: new DBCollection(Cache, adapter),
  cursors: new DBCollection(Cursor, adapter),
  events: new DBCollection(Event, adapter),
  queue: new DBCollection(Event, adapter)
};
