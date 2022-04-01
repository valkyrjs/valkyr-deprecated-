import { projection } from "@valkyr/server";
import type { Workspace } from "stores";

import { collection } from "../../Database/Collections";

projection.on<Workspace.Created>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await collection.workspaces.insertOne({
    id: streamId,
    name,
    members
  });
});

projection.on<Workspace.MemberAdded>("WorkspaceMemberAdded", async ({ streamId, data }) => {
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
