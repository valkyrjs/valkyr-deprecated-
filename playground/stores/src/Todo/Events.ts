import { createEvent, Event as LedgerEvent } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { Item, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<Created>("TodoCreated"),
  removed: createEvent<Removed>("TodoRemoved"),
  sortSet: createEvent<ItemSortSet>("TodoItemSortSet"),
  item: {
    added: createEvent<ItemAdded>("TodoItemAdded"),
    textSet: createEvent<ItemTextSet>("TodoItemTextSet"),
    sortSet: createEvent<ItemSortSet>("TodoItemSortSet"),
    done: createEvent<ItemDone>("TodoItemDone"),
    undone: createEvent<ItemUndone>("TodoItemUndone"),
    removed: createEvent<ItemRemoved>("TodoItemRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"TodoCreated", Pick<State, "workspaceId" | "name">, Auditor>;
export type Removed = LedgerEvent<"TodoRemoved", never, Auditor>;
export type SortSet = LedgerEvent<"TodoSortSet", Pick<Item, "id" | "sort">, Auditor>;

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
