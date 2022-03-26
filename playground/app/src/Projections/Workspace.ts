import { projection } from "@valkyr/ledger-client";
import { WorkspaceCreated } from "stores";

import { Workspace } from "../Models/Workspace";

projection.on<WorkspaceCreated>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await Workspace.insert({
    id: streamId,
    name,
    members
  });
});
