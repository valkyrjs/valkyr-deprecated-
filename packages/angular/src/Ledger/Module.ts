import { NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Database } from "../Database";
import { Cursor, CursorDocument } from "./Models/Cursor";
import { Event, EventDocument } from "./Models/Event";

@NgModule({
  providers: [
    Database.for([
      {
        model: Cursor,
        collection: new Collection<CursorDocument>("cursors", new IndexedDbAdapter())
      },
      {
        model: Event,
        collection: new Collection<EventDocument>("events", new IndexedDbAdapter())
      }
    ])
  ]
})
export class LedgerModule {}
