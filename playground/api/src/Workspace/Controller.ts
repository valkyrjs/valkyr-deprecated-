import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Auditor } from "@valkyr/nestjs";

import { WorkspaceLedgerService } from "./Services/Ledger";
import { TodoService } from "./Services/Todo";
import { WorkspaceService } from "./Services/Workspace";

@Controller("/workspaces")
export class WorkspaceController {
  constructor(
    private readonly todos: TodoService,
    private readonly workspaces: WorkspaceService,
    private readonly ledger: WorkspaceLedgerService
  ) {}

  @Post()
  public async createWorkspace(@Body("name") name: string, @Auditor() auditor: string) {
    return this.ledger.create(name, auditor);
  }

  @Get()
  public async getWorkspace(@Auditor() auditor: string) {
    const workspaces = await this.workspaces.getByAccount(auditor);
    return workspaces.map((workspace) => workspace.id);
  }

  @Post(":id/invites")
  public async createInvite(
    @Param("id") workspaceId: string,
    @Body("email") email: string,
    @Auditor() auditor: string
  ) {
    await this.ledger.invite(workspaceId, email, auditor);
  }

  @Get(":id/todos")
  public async getTodos(@Param("id") workspaceId: string) {
    return this.todos.get(workspaceId);
  }
}
