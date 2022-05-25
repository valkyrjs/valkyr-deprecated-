import { ForbiddenException } from "@nestjs/common";
import { LedgerService } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { Validate, Validator } from "@valkyr/nestjs";
import { WorkspaceStore } from "stores";

import { WorkspaceAccess } from "../Access";

@Validator()
export class WorkspaceValidator {
  constructor(readonly access: WorkspaceAccess, readonly ledger: LedgerService) {}

  @Validate("WorkspaceInviteCreated")
  public async validateWorkspaceInviteCreated(event: LedgerEventRecord<WorkspaceStore.InviteCreated>) {
    const workspace = await this.ledger.reduce(event.streamId, WorkspaceStore.Workspace);
    if (workspace === undefined) {
      throw new Error("Workspace Validation: Workspace not found");
    }

    const member = await workspace.members.getById(event.meta.auditor);
    if (member === undefined) {
      throw new Error("Workspace Validation: Member not found");
    }

    const permission = await this.access.for("workspace").can(event.meta.auditor, "createInvite");
    if (permission.granted === false) {
      throw new ForbiddenException(
        "Workspace Validation: Member does not have required permission to create invitations"
      );
    }
  }
}
