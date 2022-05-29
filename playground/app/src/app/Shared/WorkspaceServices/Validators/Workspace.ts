import { Injectable } from "@angular/core";
import { LedgerService, Validate, Validator } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { WorkspaceStore } from "stores";

import { WorkspaceAccess } from "../Access";

@Injectable({ providedIn: "root" })
export class WorkspaceValidator extends Validator {
  constructor(readonly access: WorkspaceAccess, readonly ledger: LedgerService) {
    super();
  }

  @Validate("WorkspaceInviteCreated")
  public async validateWorkspaceInviteCreated(event: LedgerEventRecord<WorkspaceStore.InviteCreated>) {
    const permission = await this.access.for("workspace").can(event.meta.auditor, "createInvite");
    if (permission.granted === false) {
      throw new Error("Workspace Validation: Member does not have required permission to create invitations");
    }
  }
}
