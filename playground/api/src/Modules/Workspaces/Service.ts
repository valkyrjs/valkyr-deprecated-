import { ledger } from "@valkyr/server";
import { Workspace } from "stores";

import { collection } from "../../Database/Collections";

export async function isWorkspaceMember(workspaceId: string, email: string) {
  const workspace = await ledger.reduce(workspaceId, Workspace.Workspace);
  if (workspace === undefined) {
    return false;
  }

  const count = await collection.accounts.count({
    id: {
      $in: workspace.members.getAccountIds()
    },
    email
  });

  if (count === 0) {
    return false;
  }

  return true;
}
