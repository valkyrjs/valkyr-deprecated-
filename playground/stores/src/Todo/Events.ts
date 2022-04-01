import { createEvent, Event } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { TodoState } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<TodoCreated>("TodoCreated"),
  removed: createEvent<TodoRemoved>("TodoRemoved")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type TodoCreated = Event<"TodoCreated", Pick<TodoState, "workspaceId" | "name">, Auditor>;
export type TodoRemoved = Event<"TodoRemoved", never, Auditor>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type TodoEvent = TodoCreated | TodoRemoved;
