import { NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Database } from "../Database";
import { Role, RoleDocument } from "./Models/Role";

@NgModule({
  providers: [
    Database.for([
      {
        model: Role,
        collection: new Collection<RoleDocument>("cursors", new IndexedDbAdapter())
      }
    ])
  ]
})
export class AccessModule {}
