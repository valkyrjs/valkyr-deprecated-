import { Module } from "@nestjs/common";

import { WorkspaceAccess } from "./Access";
import { WorkspaceCommands } from "./Commands";
import { WorkspaceProjector } from "./Projectors/WorkspaceProjector";
import { WorkspaceValidator } from "./Validators/WorkspaceValidator";

@Module({
  providers: [WorkspaceAccess, WorkspaceProjector, WorkspaceValidator],
  controllers: [WorkspaceCommands]
})
export class WorkspaceModule {}
