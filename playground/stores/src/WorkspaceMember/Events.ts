import { createEvent, Event } from "@valkyr/ledger";

import type { Account } from "../Account";
import { Workspace } from "../Workspace/Aggregate";
import type { Auditor } from "./Auditor";

export type WorkspaceMemberAdded = Event<
  "WorkspaceMemberAdded",
  {
    workspaceId: Workspace["id"];
    accountId: Account["id"];
  },
  Auditor
>;
export type WorkspaceMemberRemoved = Event<"WorkspaceMemberRemoved", unknown, Auditor>;

export const events = {
  added: createEvent<WorkspaceMemberAdded>("WorkspaceMemberAdded"),
  removed: createEvent<WorkspaceMemberRemoved>("WorkspaceMemberRemoved")
};
