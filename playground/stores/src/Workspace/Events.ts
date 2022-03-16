import { createEvent, Event } from "@valkyr/ledger";

import type { Account } from "../Account";
import type { Auditor } from "../Member";
import type { Workspace } from "./Aggregate";

export type WorkspaceCreated = Event<"WorkspaceCreated", Pick<Workspace, "name">, { auditor: Account["id"] }>;
export type WorkspaceNameSet = Event<"WorkspaceNameSet", Pick<Workspace, "name">, Auditor>;
export type WorkspaceRemoved = Event<"WorkspaceRemoved", never, never>;

export const events = {
  created: createEvent<WorkspaceCreated>("WorkspaceCreated"),
  nameSet: createEvent<WorkspaceNameSet>("WorkspaceNameSet"),
  removed: createEvent<WorkspaceRemoved>("WorkspaceRemoved")
};
