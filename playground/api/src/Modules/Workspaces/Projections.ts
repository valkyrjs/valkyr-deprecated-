import { projection } from "@valkyr/server";
import { Workspace, workspace } from "stores";

import { collection } from "../../Database/Collections";

projection.on<Workspace.Created>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await Promise.all([
    collection.workspaces.insertOne({
      id: streamId,
      name,
      members
    }),
    workspace.access.setup(
      streamId,
      members.map((member) => member.id)
    )
  ]);
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
