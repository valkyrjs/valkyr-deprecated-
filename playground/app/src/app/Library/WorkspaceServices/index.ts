import { NgModule } from "@angular/core";
import { Database } from "@valkyr/angular";
import { Collection, IndexedDbAdapter } from "@valkyr/db";

import { Workspace, WorkspaceDocument } from "./Models/Workspace";
import { WorkspaceProjector } from "./Projector";
import { WorkspaceService } from "./WorkspaceService";
import { WorkspaceSubscriberService } from "./WorkspaceSubscriberService";

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    Database.for([
      {
        model: Workspace,
        collection: new Collection<WorkspaceDocument>("workspaces", new IndexedDbAdapter())
      }
    ]),
    WorkspaceProjector.register(),
    WorkspaceService,
    WorkspaceSubscriberService
  ]
})
export class WorkspaceServicesModule {}

export * from "./Models";
export * from "./WorkspaceService";
export * from "./WorkspaceSubscriberService";
