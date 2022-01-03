import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { WorkspaceAccess } from "./Access";
import { WorkspaceController } from "./Controller";
import { Todo, TodoSchema } from "./Models/Todo";
import { Workspace, WorkspaceSchema } from "./Models/Workspace";
import { TodoProjector } from "./Projectors/Todo";
import { WorkspaceProjector } from "./Projectors/Workspace";
import { WorkspaceLedgerService } from "./Services/Ledger";
import { TodoService } from "./Services/Todo";
import { WorkspaceService } from "./Services/Workspace";
import { TodoValidator } from "./Validators/Todo";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Workspace.name,
        schema: WorkspaceSchema
      }
    ])
  ],
  controllers: [WorkspaceController],
  providers: [
    TodoService,
    TodoProjector,
    TodoValidator,
    WorkspaceAccess,
    WorkspaceService,
    WorkspaceLedgerService,
    WorkspaceProjector
  ]
})
export class WorkspaceModule {}
