import { projection } from "@valkyr/ledger-client";
import { WorkspaceCreated } from "stores";

import { Workspace } from "../Models/Workspace";
import { WorkspaceMember } from "../Models/WorkspaceMember";

projection.on<WorkspaceCreated>("WorkspaceCreated", async ({ streamId, data: { name } }) => {
  await Workspace.insert({
    id: streamId,
    name
  });
});

projection.once<WorkspaceCreated>("WorkspaceCreated", async ({ streamId, meta: { auditor } }) => {
  WorkspaceMember.add(streamId, auditor);
});
