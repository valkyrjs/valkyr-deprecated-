import { projection } from "@valkyr/server";
import { Workspace, workspace } from "stores";

import { workspaces } from "./Model";

projection.on<Workspace.Created>("WorkspaceCreated", async ({ streamId, data: { name, members } }) => {
  await Promise.all([
    workspaces.insertOne({
      id: streamId,
      name,
      invites: [],
      members
    }),
    workspace.access.setup(
      streamId,
      members.map((member) => member.id)
    )
  ]);
});

projection.on<Workspace.MemberAdded>("WorkspaceMemberAdded", async ({ streamId, data }) => {
  await workspaces.updateOne(
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
