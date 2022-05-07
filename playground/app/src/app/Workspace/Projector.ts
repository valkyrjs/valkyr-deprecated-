import { EventProjector, On, Projector } from "@valkyr/angular";
import { WorkspaceStore } from "stores";

import { Workspace } from "./Models/Workspace";

@Projector()
export class WorkspaceProjector extends EventProjector {
  @On("WorkspaceCreated")
  public async onWorkspaceCreated({ streamId, data: { name, members } }: WorkspaceStore.Created) {
    await Workspace.insertOne({
      id: streamId,
      name,
      color: "",
      invites: [] as WorkspaceStore.Invite[],
      members
    });
  }

  @On("WorkspaceInviteCreated")
  public async onWorkspaceInviteCreated({ streamId, data }: WorkspaceStore.InviteCreated) {
    const workspace = await Workspace.findById(streamId);
    if (workspace && workspace.invites.get(data.id) === undefined) {
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
