import { Collection as DBCollection } from "@valkyr/db";

import { Cache } from "./Models/Cache";
import { Cursor } from "./Models/Cursor";
import { Event } from "./Models/Event";
import { Account } from "./Modules/Account/Models/Account";
import { adapter } from "./Providers/IdbAdapter";

export type Collection = keyof typeof collection;

export const collection = {
  accounts: new DBCollection(Account, adapter),
  cache: new DBCollection(Cache, adapter),
  cursors: new DBCollection(Cursor, adapter),
  events: new DBCollection(Event, adapter),
  queue: new DBCollection(Event, adapter)
};
