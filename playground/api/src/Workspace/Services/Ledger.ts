import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { LedgerService } from "@valkyr/nestjs";
import { getId } from "@valkyr/security";
import { WorkspaceStore } from "stores";

import { WorkspaceAccess } from "../Access";

@Injectable()
export class WorkspaceLedgerService {
  constructor(private readonly ledger: LedgerService, private readonly access: WorkspaceAccess) {}

  public async create(name: string, publicKey: string) {
    // const member: WorkspaceStore.Member = { id: getId(), name, publicKey };
    // await this.ledger.append(
    //   getId(),
    //   WorkspaceStore.events.created(
    //     {
    //       name,
    //       members: [member]
    //     },
    //     {
    //       auditor: member.id
    //     }
    //   )
    // );
  }

  public async invite(workspaceId: string, email: string, memberId: string) {
    const workspace = await this.getWorkspace(workspaceId);

    const member = workspace.members.getById(memberId);
    if (member === undefined) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    const invite = await workspace.invites.getByEmail(email);
    if (invite !== undefined) {
      throw new ConflictException("Workspace invite for this email has already been issued.");
    }

    const permission = await this.access.for("workspace").can(member.id, "createInvite");
    if (permission.granted === false) {
      throw new ForbiddenException(permission.message);
    }

    await this.ledger.append(
      workspaceId,
      WorkspaceStore.events.invite.created(
        {
          id: getId(),
          email
        },
        {
          auditor: memberId
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
