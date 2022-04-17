import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LedgerModule } from "@valkyr/nestjs";

import { WorkspaceController } from "./Controller";
import { Workspace, WorkspaceSchema } from "./Model";
import { WorkspaceProjector } from "./Projector";
import { WorkspaceLedgerService } from "./Services/Ledger";
import { WorkspaceService } from "./Services/Workspace";

@Module({
  imports: [
    LedgerModule,
    MongooseModule.forFeature([
      {
        name: Workspace.name,
        schema: WorkspaceSchema
      }
    ])
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceLedgerService, WorkspaceProjector]
})
export class WorkspaceModule {}
