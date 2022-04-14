import { ledger } from "@valkyr/client";
import { Workspace as Wksp } from "stores";

import { Workspace } from "../Models/Workspace";

ledger.projection.on<Wksp.Created>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await Workspace.insert({
    id: streamId,
    name,
    members
  });
});

ledger.projection.on<Wksp.InviteCreated>("WorkspaceInviteCreated", async ({ streamId, data }) => {
  const workspace = await Workspace.findById(streamId);
  if (workspace && workspace.invites.get(data.id) === undefined) {
    await Workspace.update({
      id: streamId,
      invites: [...(workspace.invites.getAll() ?? []), data]
    });
  }
});
