import { On, Projector } from "@valkyr/client";
import type { WorkspaceStore } from "stores";

import { Workspace } from "./Model";

@Projector()
export class WorkspaceProjector {
  @On("WorkspaceCreated")
  public async created({ streamId, data: { name, members } }: WorkspaceStore.Created) {
    await Workspace.insertOne({
      id: streamId,
      name,
      invites: [],
      members
    });
  }

  @On("WorkspaceInviteCreated")
  public async inviteCreated({ streamId, data }: WorkspaceStore.InviteCreated) {
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
