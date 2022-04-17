import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Auditor } from "@valkyr/nestjs";

import { WorkspaceLedgerService } from "./Services/Ledger";
import { WorkspaceService } from "./Services/Workspace";

@Controller("/workspaces")
export class WorkspaceController {
  constructor(private readonly workspaces: WorkspaceService, private readonly ledger: WorkspaceLedgerService) {}

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
    // const permission = await workspace.access.for("workspace").can(memberId, "addMember");
    // if (permission.granted === false) {
    //   return this.reject(403, permission.message);
    // }
    // await createInvite(workspaceId, email, memberId);
  }
}
