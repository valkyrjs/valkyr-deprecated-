import { NgModule } from "@angular/core";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Database } from "../Database";
import { Role, RoleDocument } from "./Models/Role";
import { PermissionService } from "./Services/PermissionService";
import { RoleService } from "./Services/RoleService";

@NgModule({
  providers: [
    Database.for([
      {
        model: Role,
        collection: new Collection<RoleDocument>("roles", new IndexedDbAdapter())
      }
    ]),
    RoleService,
    PermissionService
  ]
})
export class AccessModule {}
