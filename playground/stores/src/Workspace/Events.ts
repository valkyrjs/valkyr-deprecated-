import { createEvent, Event } from "@valkyr/ledger";

import type { WorkspaceMember, WorkspaceState } from "./Aggregate";
import type { Auditor } from "./Auditor";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<WorkspaceCreated>("WorkspaceCreated"),
  nameSet: createEvent<WorkspaceNameSet>("WorkspaceNameSet"),
  removed: createEvent<WorkspaceRemoved>("WorkspaceRemoved"),
  member: {
    added: createEvent<WorkspaceMemberAdded>("WorkspaceMemberAdded"),
    removed: createEvent<WorkspaceMemberRemoved>("WorkspaceMemberRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type WorkspaceCreated = Event<"WorkspaceCreated", Pick<WorkspaceState, "name" | "members">, Auditor>;
export type WorkspaceNameSet = Event<"WorkspaceNameSet", Pick<WorkspaceState, "name">, Auditor>;
export type WorkspaceRemoved = Event<"WorkspaceRemoved", never, never>;
export type WorkspaceMemberAdded = Event<"WorkspaceMemberAdded", WorkspaceMember, Auditor>;
export type WorkspaceMemberRemoved = Event<"WorkspaceMemberRemoved", Pick<WorkspaceMember, "id">, Auditor>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type WorkspaceEvent =
  | WorkspaceCreated
  | WorkspaceNameSet
  | WorkspaceRemoved
  | WorkspaceMemberAdded
  | WorkspaceMemberRemoved;
