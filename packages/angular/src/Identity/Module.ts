import { NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";
import { UserIdentitySchema } from "@valkyr/identity";

import { Database } from "../Database";
import { PrivateIdentity, PrivateIdentityDocument } from "./Models/PrivateIdentity";
import { UserIdentity } from "./Models/UserIdentity";

@NgModule({
  providers: [
    Database.for([
      {
        model: PrivateIdentity,
        collection: new Collection<PrivateIdentityDocument>("identities", new IndexedDbAdapter())
      },
      {
        model: UserIdentity,
        collection: new Collection<UserIdentitySchema>("users", new IndexedDbAdapter())
      }
    ])
  ]
})
export class IdentityModule {}
