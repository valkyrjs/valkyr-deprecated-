import { ledger } from "@valkyr/server";
import { nanoid } from "@valkyr/utils";
import { workspace } from "stores";

import { collection } from "../../Database/Collections";
import { hasBody } from "../../Policies/hasBody";
import { isRequestAuthenticated } from "../../Policies/isAuthenticated";
import { isWorkspaceMember } from "../../Policies/isWorkspaceMember";
import { route } from "../../Providers/Server";

/*
 |--------------------------------------------------------------------------------
 | Workspaces
 |--------------------------------------------------------------------------------
 */

route.get("/workspaces", [
  isRequestAuthenticated,
  async function ({ auth }) {
    const workspaces = await collection.workspaces
      .find({
        "members.accountId": auth.auditor
      })
      .toArray();
    return this.resolve(workspaces.map((workspace) => workspace.id));
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Invite
 |--------------------------------------------------------------------------------
 */

route.post("/workspaces/:workspaceId/invite", [
  isRequestAuthenticated,
  hasBody(["email"]),
  isWorkspaceMember((req) => req.params.workspaceId),
  async function ({ params: { workspaceId }, body: { email }, state: { memberId } }) {
    const invite = await collection.invites.findOne({ workspaceId, email });
    if (invite !== null) {
      return this.reject(400, "Workspace invite for this email has already been issued.", {
        email
      });
    }

    const permission = await workspace.access.for("workspace").can(memberId, "addMember");
    if (permission.granted === false) {
      return this.reject(403, permission.message);
    }

    await collection.invites.insertOne({
      workspaceId,
      token: nanoid(),
      email,
      auditor: memberId
    });

    return this.resolve();
  }
]);

route.post("/invites/:token/accept", [
  isRequestAuthenticated,
  hasBody(["email", "name"]),
  async function ({ params: { token }, body: { email, name }, auth }) {
    const invite = await collection.invites.findOne({ token, email });
    if (invite === null) {
      return this.reject(404, "Workspace invitation does not exist, or has expired.");
    }

    const account = await collection.accounts.findOne({ id: auth.auditor });
    if (account === null) {
      return this.reject(403, "Could not verify your account, try again later.");
    }

    if (invite.email !== account.email) {
      return this.reject(
        403,
        "You are not a valid recipient of this invitation, if you changed your email recently request another invitation."
      );
    }

    await ledger.insert(
      workspace.member.added(
        invite.workspaceId,
        {
          id: nanoid(),
          accountId: auth.auditor,
          name
        },
        {
          auditor: invite.auditor
        }
      )
    );
    return this.resolve();
  }
]);

route.get("/workspaces/:workspaceId/invites", [
  isRequestAuthenticated,
  isWorkspaceMember((req) => req.params.workspaceId),
  async function ({ params: { workspaceId } }) {
    return this.resolve(await collection.invites.find({ workspaceId }).toArray());
  }
]);
