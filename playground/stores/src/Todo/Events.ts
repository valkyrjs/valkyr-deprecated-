import { LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { Item, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: makeEventFactory<Created>("TodoCreated"),
  removed: makeEventFactory<Removed>("TodoRemoved"),
  sortSet: makeEventFactory<SortSet>("TodoSortSet"),
  item: {
    added: makeEventFactory<ItemAdded>("TodoItemAdded"),
    textSet: makeEventFactory<ItemTextSet>("TodoItemTextSet"),
    sortSet: makeEventFactory<ItemSortSet>("TodoItemSortSet"),
    done: makeEventFactory<ItemDone>("TodoItemDone"),
    undone: makeEventFactory<ItemUndone>("TodoItemUndone"),
    removed: makeEventFactory<ItemRemoved>("TodoItemRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"TodoCreated", Pick<State, "workspaceId" | "name">, Auditor>;
export type Removed = LedgerEvent<"TodoRemoved", never, Auditor>;
export type SortSet = LedgerEvent<"TodoSortSet", Pick<Item, "sort">, Auditor>;

export type ItemAdded = LedgerEvent<"TodoItemAdded", Pick<Item, "id" | "text">, Auditor>;
export type ItemTextSet = LedgerEvent<"TodoItemTextSet", Pick<Item, "id" | "text">, Auditor>;
export type ItemSortSet = LedgerEvent<"TodoItemSortSet", Pick<Item, "id" | "sort">, Auditor>;
export type ItemDone = LedgerEvent<"TodoItemDone", Pick<Item, "id">, Auditor>;
export type ItemUndone = LedgerEvent<"TodoItemUndone", Pick<Item, "id">, Auditor>;
export type ItemRemoved = LedgerEvent<"TodoItemRemoved", Pick<Item, "id">, Auditor>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type Event =
  | Created
  | Removed
  | SortSet
  | ItemAdded
  | ItemTextSet
  | ItemSortSet
  | ItemDone
  | ItemUndone
  | ItemRemoved;

export type EventRecord = LedgerEventToLedgerRecord<Event>;
