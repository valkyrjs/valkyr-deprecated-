import { ledger } from "@valkyr/ledger-server";
import { nanoid } from "@valkyr/utils";
import { Workspace, workspace } from "stores";

import { collection } from "../../Database/Collections";
import { isRequestAuthenticated } from "../../Policies/isAuthenticated";
import { route } from "../../Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Workspaces
 |--------------------------------------------------------------------------------
 */

route.get("/workspaces", [
  isRequestAuthenticated,
  async function ({ auth }) {
    return this.resolve(
      await collection.workspaces
        .find({
          "members.accountId": auth.auditor
        })
        .toArray()
    );
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Invite
 |--------------------------------------------------------------------------------
 */

route.post("/workspaces/:workspaceId/invite", [
  isRequestAuthenticated,
  async function ({ params: { workspaceId }, body: { email }, auth }) {
    const state = await ledger.reduce(workspaceId, Workspace);
    if (state === undefined) {
      return this.reject(404, "Workspace does not exist, or has been removed.");
    }
    await collection.invites.insertOne({
      workspaceId,
      token: nanoid(),
      email,
      auditor: auth.auditor
    });
    return this.resolve();
  }
]);

route.post("/invites/:token/accept", [
  isRequestAuthenticated,
  async function ({ params: { token }, body: { email }, auth }) {
    const invite = await collection.invites.findOne({ token, email });
    if (invite === null) {
      return this.reject(404, "Workspace invitation does not exist, or has expired.");
    }
    await ledger.insert(
      workspace.member.added(
        invite.workspaceId,
        {
          id: nanoid(),
          accountId: auth.auditor,
          name: ""
        },
        {
          auditor: invite.auditor
        }
      )
    );
    return this.resolve();
  }
]);
