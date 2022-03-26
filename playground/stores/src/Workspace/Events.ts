import { createEvent, Event } from "@valkyr/ledger";

import type { Account } from "../Account";
import type { Member, Workspace } from "./Aggregate";
import type { Auditor } from "./Auditor";

export type WorkspaceCreated = Event<"WorkspaceCreated", Pick<Workspace, "name">, { auditor: Account["id"] }>;
export type WorkspaceNameSet = Event<"WorkspaceNameSet", Pick<Workspace, "name">, Auditor>;
export type WorkspaceRemoved = Event<"WorkspaceRemoved", never, never>;

export type WorkspaceMemberAdded = Event<"WorkspaceMemberAdded", Member, Auditor>;
export type WorkspaceMemberRemoved = Event<"WorkspaceMemberRemoved", Pick<Member, "id">, Auditor>;

export const events = {
  created: createEvent<WorkspaceCreated>("WorkspaceCreated"),
  nameSet: createEvent<WorkspaceNameSet>("WorkspaceNameSet"),
  removed: createEvent<WorkspaceRemoved>("WorkspaceRemoved"),
  member: {
    added: createEvent<WorkspaceMemberAdded>("WorkspaceMemberAdded"),
    removed: createEvent<WorkspaceMemberRemoved>("WorkspaceMemberRemoved")
  }
};
