import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LedgerModule } from "@valkyr/nestjs";

import { WorkspaceController } from "./Controller";
import { Workspace, WorkspaceSchema } from "./Model";
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
  providers: [WorkspaceService]
})
export class WorkspaceModule {}
