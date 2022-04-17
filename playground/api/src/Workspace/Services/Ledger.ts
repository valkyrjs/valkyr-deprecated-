import { ConflictException, Injectable } from "@nestjs/common";
import { LedgerService } from "@valkyr/nestjs";
import { nanoid } from "@valkyr/utils";
import { WorkspaceStore } from "stores";

import { WorkspaceService } from "./Workspace";

@Injectable()
export class WorkspaceLedgerService {
  constructor(private readonly ledger: LedgerService, private readonly workspaces: WorkspaceService) {}

  public async invite(workspaceId: string, email: string, auditor: string) {
    const workspace = await this.getWorkspace(workspaceId);

    const invite = await workspace.invites.getByEmail(email);
    if (invite !== undefined) {
      throw new ConflictException("Workspace invite for this email has already been issued.");
    }

    // const permission = await workspace.access.for("workspace").can(memberId, "addMember");
    // if (permission.granted === false) {
    //   throw new Error(permission.message)
    // }

    await this.ledger.insert(
      WorkspaceStore.events.invite.created(
        workspaceId,
        {
          id: nanoid(),
          email
        },
        {
          auditor
        }
      )
    );
  }

  public async getWorkspace(workspaceId: string) {
    const workspace = await this.ledger.reduce(workspaceId, WorkspaceStore.Workspace);
    if (workspace === undefined) {
      throw new Error("Workspace does not exist or has been removed");
    }
    return workspace;
  }
}
