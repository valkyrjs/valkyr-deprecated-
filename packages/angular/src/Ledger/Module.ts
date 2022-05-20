import { NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Database } from "../Database";
import { Event, EventDocument } from "./Models/Event";

@NgModule({
  providers: [
    Database.for([
      {
        model: Event,
        collection: new Collection<EventDocument>("events", new IndexedDbAdapter())
      }
    ])
  ]
})
export class LedgerModule {}
