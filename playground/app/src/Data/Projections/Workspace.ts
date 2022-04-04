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
