import { ForbiddenException } from "@nestjs/common";
import { LedgerEventRecord } from "@valkyr/ledger";
import { Validate, Validator } from "@valkyr/nestjs";
import { TodoStore } from "stores";

import { WorkspaceAccess } from "../Access";

@Validator()
export class WorkspaceValidator {
  constructor(readonly access: WorkspaceAccess) {}

  @Validate("WorkspaceInviteCreated")
  public async validateInviteCreated(event: LedgerEventRecord<TodoStore.Created>) {
    const permission = await this.access.for("workspace").can(event.meta.auditor, "createInvite");
    if (permission.granted === false) {
      throw new ForbiddenException("Workspace Violation: Member does not have required permission to create invites");
    }
  }
}
