import { Injectable } from "@angular/core";
import { On, Projector } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { WorkspaceStore } from "stores";

import { WorkspaceAccess } from "./Access";
import { Workspace } from "./Models/Workspace";

@Injectable({ providedIn: "root" })
export class WorkspaceProjector extends Projector {
  constructor(readonly access: WorkspaceAccess) {
    super();
  }

  @On("WorkspaceCreated")
  public async onWorkspaceCreated({ streamId, data: { name, members } }: LedgerEventRecord<WorkspaceStore.Created>) {
    await Workspace.insertOne({
      id: streamId,
      name,
      color: "",
      invites: [] as WorkspaceStore.Invite[],
      members
    });
    await this.access.createAdminRole(
      streamId,
      members.map((member) => member.id)
    );
    await this.access.createMemberRole(streamId);
  }

  @On("WorkspaceInviteCreated")
  public async onWorkspaceInviteCreated({ streamId, data }: LedgerEventRecord<WorkspaceStore.InviteCreated>) {
    const workspace = await Workspace.findById(streamId);
    if (workspace && workspace.invites.getById(data.id) === undefined) {
      await Workspace.updateOne(
        {
          id: streamId
        },
        {
          $push: {
            invites: data
          }
        }
      );
    }
  }
}
