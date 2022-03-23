import { projection } from "@valkyr/ledger";
import { WorkspaceMemberAdded } from "stores";

import { WorkspaceMember } from "../Models/WorkspaceMember";

projection.on<WorkspaceMemberAdded>("WorkspaceMemberAdded", async ({ streamId, data: { workspaceId, accountId } }) => {
  await WorkspaceMember.insert({
    id: streamId,
    workspaceId,
    accountId
  });
});
