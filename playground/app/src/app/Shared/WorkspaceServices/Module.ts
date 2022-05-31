import { NgModule } from "@angular/core";
import { Database } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { WorkspaceAccess } from "./Access";
import { CurrentWorkspaceService } from "./CurrentWorkspaceService";
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
    CurrentWorkspaceService,
    WorkspaceAccess,
    WorkspaceService,
    WorkspaceSubscriberService
  ]
})
export class WorkspaceServicesModule {}
