import { Event, EventAuditor, makeEvent } from "@valkyr/ledger";

/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */

export const workspaceCreated = makeEvent<WorkspaceCreated>("WorkspaceCreated");

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type WorkspaceCreated = Event<
  "WorkspaceCreated",
  {
    name: string;
    user: {
      name: string;
    };
  },
  EventAuditor
>;

/*
 |--------------------------------------------------------------------------------
 | Event Records
 |--------------------------------------------------------------------------------
 */

export type WorkspaceEvent = WorkspaceCreated;
