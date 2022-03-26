import { Event } from "@valkyr/ledger";

import type { Workspace, WorkspaceMember } from "./Aggregate";
import type { Auditor } from "./Auditor";

export type WorkspaceEvent =
  | WorkspaceCreated
  | WorkspaceNameSet
  | WorkspaceRemoved
  | WorkspaceMemberAdded
  | WorkspaceMemberRemoved;

export type WorkspaceCreated = Event<"WorkspaceCreated", Pick<Workspace, "name" | "members">, Auditor>;
export type WorkspaceNameSet = Event<"WorkspaceNameSet", Pick<Workspace, "name">, Auditor>;
export type WorkspaceRemoved = Event<"WorkspaceRemoved", never, never>;

export type WorkspaceMemberAdded = Event<"WorkspaceMemberAdded", WorkspaceMember, Auditor>;
export type WorkspaceMemberRemoved = Event<"WorkspaceMemberRemoved", Pick<WorkspaceMember, "id">, Auditor>;
