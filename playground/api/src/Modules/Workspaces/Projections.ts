import { projection } from "@valkyr/server";
import type { WorkspaceCreated, WorkspaceMemberAdded } from "stores";

import { collection } from "../../Database/Collections";

projection.on<WorkspaceCreated>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await collection.workspaces.insertOne({
    id: streamId,
    name,
    members
  });
});

projection.on<WorkspaceMemberAdded>("WorkspaceMemberAdded", async ({ streamId, data }) => {
  await collection.workspaces.updateOne(
    {
      id: streamId
    },
    {
      $push: {
        members: data
      }
    }
  );
});
