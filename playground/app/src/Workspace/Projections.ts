import { ledger } from "@valkyr/client";
import { WorkspaceStore } from "stores";

import { Workspace } from "./Model";

ledger.projection.on<WorkspaceStore.Created>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await Workspace.insert({
    id: streamId,
    name,
    members
  });
});

ledger.projection.on<WorkspaceStore.InviteCreated>("WorkspaceInviteCreated", async ({ streamId, data }) => {
  const workspace = await Workspace.findById(streamId);
  if (workspace && workspace.invites.get(data.id) === undefined) {
    await Workspace.update({
      id: streamId,
      invites: [...(workspace.invites.getAll() ?? []), data]
    });
  }
});
