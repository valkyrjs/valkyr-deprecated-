import { Event } from "@valkyr/ledger";

import type { Workspace, WorkspaceMember } from "./Aggregate";
import type { Auditor } from "./Auditor";

/*
 |--------------------------------------------------------------------------------
 | Workspace Creation
 |--------------------------------------------------------------------------------
 */

export type WorkspaceCreated = Event<
  "WorkspaceCreated",
  {
    name: Workspace["name"];
    members: WorkspaceMember[];
  },
  Auditor
>;

/*
 |--------------------------------------------------------------------------------
 | Workspace Details
 |--------------------------------------------------------------------------------
 */

export type WorkspaceNameSet = Event<
  "WorkspaceNameSet",
  {
    name: Workspace["name"];
  },
  Auditor
>;

/*
 |--------------------------------------------------------------------------------
 | Workspace Removal
 |--------------------------------------------------------------------------------
 */

export type WorkspaceRemoved = Event<"WorkspaceRemoved", never, never>;

/*
 |--------------------------------------------------------------------------------
 | Workspace Memberships
 |--------------------------------------------------------------------------------
 */

export type WorkspaceMemberAdded = Event<"WorkspaceMemberAdded", WorkspaceMember, Auditor>;

export type WorkspaceMemberRemoved = Event<
  "WorkspaceMemberRemoved",
  {
    id: WorkspaceMember["id"];
  },
  Auditor
>;

/*
 |--------------------------------------------------------------------------------
 | Event Exports
 |--------------------------------------------------------------------------------
 */

export type WorkspaceEvent =
  | WorkspaceCreated
  | WorkspaceNameSet
  | WorkspaceRemoved
  | WorkspaceMemberAdded
  | WorkspaceMemberRemoved;
