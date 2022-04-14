import { HttpAction } from "@valkyr/server";
import { IncomingMessage } from "http";
import { Workspace } from "stores";

import { ledger } from "../Server";

/*
 |--------------------------------------------------------------------------------
 | Policies
 |--------------------------------------------------------------------------------
 */

export function isWorkspaceMember(getWorkspaceId: (req: IncomingMessage) => string): HttpAction {
  return async function (req) {
    const workspaceId = getWorkspaceId(req);

    const workspace = await ledger.reduce(workspaceId, Workspace.Workspace);
    if (workspace === undefined) {
      return this.reject(404, "Workspace does not exist, or has been removed.");
    }

    const member = workspace.members.getByAccount(req.auth.auditor);
    if (member === undefined) {
      return this.reject(403, "You are not a member of this workspace.");
    }

    return this.accept({ memberId: member.id });
  };
}
