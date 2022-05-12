import { ModuleWithProviders, NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Database } from "../Database";
import { Event, EventDocument } from "../Ledger";
import { GunService } from "./Services/GunService";

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
export class GunModule {
  static forRoot(peers: string[] = []): ModuleWithProviders<GunModule> {
    return {
      ngModule: GunModule,
      providers: [GunService.for(peers)]
    };
  }
}
