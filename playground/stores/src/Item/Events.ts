import { Ledger } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: Ledger.createEvent<Created>("ItemCreated"),
  nameSet: Ledger.createEvent<NameSet>("ItemNameSet"),

  removed: Ledger.createEvent<Removed>("ItemRemoved")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = Ledger.Event<"ItemCreated", Pick<State, "workspaceId" | "templateId" | "name">, Auditor>;
export type NameSet = Ledger.Event<"ItemNameSet", Pick<State, "name">, Auditor>;
export type Removed = Ledger.Event<"ItemRemoved", never, Auditor>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | NameSet | Removed;
