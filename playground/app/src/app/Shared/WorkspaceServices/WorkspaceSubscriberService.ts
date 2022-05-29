import { Inject, Injectable } from "@angular/core";
import { DataSubscriberService, StreamService } from "@valkyr/angular";

import { Workspace, WorkspaceModel } from "./Models/Workspace";

@Injectable({ providedIn: "any" })
export class WorkspaceSubscriberService extends DataSubscriberService<WorkspaceModel> {
  constructor(@Inject(Workspace) readonly model: WorkspaceModel, readonly stream: StreamService) {
    super();
  }
}
