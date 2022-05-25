import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { WorkspaceAccess } from "./Access";
import { Todo, TodoSchema } from "./Models/Todo";
import { Workspace, WorkspaceSchema } from "./Models/Workspace";
import { TodoProjector } from "./Projectors/TodoProjector";
import { WorkspaceProjector } from "./Projectors/WorkspaceProjector";
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
