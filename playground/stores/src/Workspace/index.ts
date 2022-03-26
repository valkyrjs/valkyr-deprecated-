import { createEvent } from "@valkyr/ledger";

import { access } from "./Access";
import {
  WorkspaceCreated,
  WorkspaceEvent,
  WorkspaceMemberAdded,
  WorkspaceMemberRemoved,
  WorkspaceNameSet,
  WorkspaceRemoved
} from "./Events";

export * from "./Aggregate";
export * from "./Auditor";

export const workspace = {
  access,
  created: createEvent<WorkspaceCreated>("WorkspaceCreated"),
  nameSet: createEvent<WorkspaceNameSet>("WorkspaceNameSet"),
  removed: createEvent<WorkspaceRemoved>("WorkspaceRemoved"),
  member: {
    added: createEvent<WorkspaceMemberAdded>("WorkspaceMemberAdded"),
    removed: createEvent<WorkspaceMemberRemoved>("WorkspaceMemberRemoved")
  }
};

export {
  WorkspaceCreated,
  WorkspaceEvent,
  WorkspaceMemberAdded,
  WorkspaceMemberRemoved,
  WorkspaceNameSet,
  WorkspaceRemoved
};
