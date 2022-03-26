import { projection } from "@valkyr/ledger-server";
import type { WorkspaceCreated } from "stores";

import { collection } from "../../Database/Collections";

projection.on<WorkspaceCreated>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await collection.workspaces.insertOne({
    id: streamId,
    name,
    members
  });
});
