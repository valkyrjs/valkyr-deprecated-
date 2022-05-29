import { NgModule } from "@angular/core";
import { Database } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { WorkspaceAccess } from "./Access";
import { Workspace, WorkspaceDocument } from "./Models/Workspace";
import { WorkspaceService } from "./WorkspaceService";
import { WorkspaceSubscriberService } from "./WorkspaceSubscriberService";

@NgModule({
  providers: [
    Database.for([
      {
        model: Workspace,
        collection: new Collection<WorkspaceDocument>("workspaces", new IndexedDbAdapter())
      }
    ]),
    WorkspaceAccess,
    WorkspaceService,
    WorkspaceSubscriberService
  ]
})
export class WorkspaceServicesModule {}
