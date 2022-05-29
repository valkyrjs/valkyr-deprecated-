import { Module } from "@nestjs/common";

import { WorkspaceAccess } from "./Access";
import { WorkspaceProjector } from "./Projectors/WorkspaceProjector";
import { WorkspaceValidator } from "./Validators/WorkspaceValidator";

@Module({
  providers: [WorkspaceAccess, WorkspaceProjector, WorkspaceValidator]
})
export class WorkspaceModule {}
