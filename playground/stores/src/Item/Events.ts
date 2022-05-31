import { LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { Item, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: makeEventFactory<Created>("ItemCreated"),
  sortSet: makeEventFactory<SortSet>("ItemSortSet"),
  detailsSet: makeEventFactory<DetailsSet>("ItemDetailsSet"),
  done: makeEventFactory<Done>("ItemDone"),
  undone: makeEventFactory<Undone>("ItemUndone"),
  removed: makeEventFactory<Removed>("ItemRemoved")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"ItemCreated", Pick<State, "workspaceId" | "name">, Auditor>;
export type Removed = LedgerEvent<"ItemRemoved", never, Auditor>;
export type SortSet = LedgerEvent<"ItemSortSet", Pick<Item, "sort">, Auditor>;
export type DetailsSet = LedgerEvent<"ItemDetailsSet", Pick<Item, "id" | "details">, Auditor>;
export type Done = LedgerEvent<"ItemDone", Pick<Item, "id">, Auditor>;
export type Undone = LedgerEvent<"ItemUndone", Pick<Item, "id">, Auditor>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | SortSet | DetailsSet | Done | Undone | Removed;

export type EventRecord = LedgerEventToLedgerRecord<Event>;
