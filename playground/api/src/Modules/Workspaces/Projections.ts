import { projection } from "@valkyr/ledger-server";
import { uuid } from "@valkyr/utils";
import type { WorkspaceCreated } from "stores";

import { collection } from "../../Collections";

projection.on<WorkspaceCreated>("WorkspaceCreated", async ({ streamId, data: { name }, meta: { auditor } }) => {
  await collection.workspaces.insertOne({
    id: streamId,
    name,
    members: [
      {
        id: uuid(),
        accountId: auditor
      }
    ]
  });
});
