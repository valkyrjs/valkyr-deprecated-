import { Ledger } from "@valkyr/ledger";

import type { Auditor } from "../Workspace";
import type { Item, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: Ledger.createEvent<Created>("TodoCreated"),
  removed: Ledger.createEvent<Removed>("TodoRemoved"),
  sortSet: Ledger.createEvent<ItemSortSet>("TodoItemSortSet"),
  item: {
    added: Ledger.createEvent<ItemAdded>("TodoItemAdded"),
    textSet: Ledger.createEvent<ItemTextSet>("TodoItemTextSet"),
    sortSet: Ledger.createEvent<ItemSortSet>("TodoItemSortSet"),
    done: Ledger.createEvent<ItemDone>("TodoItemDone"),
    undone: Ledger.createEvent<ItemUndone>("TodoItemUndone"),
    removed: Ledger.createEvent<ItemRemoved>("TodoItemRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = Ledger.Event<"TodoCreated", Pick<State, "workspaceId" | "name">, Auditor>;
export type Removed = Ledger.Event<"TodoRemoved", never, Auditor>;
export type SortSet = Ledger.Event<"TodoSortSet", Pick<Item, "id" | "sort">, Auditor>;

export type ItemAdded = Ledger.Event<"TodoItemAdded", Pick<Item, "id" | "text">, Auditor>;
export type ItemTextSet = Ledger.Event<"TodoItemTextSet", Pick<Item, "id" | "text">, Auditor>;
export type ItemSortSet = Ledger.Event<"TodoItemSortSet", Pick<Item, "id" | "sort">, Auditor>;
export type ItemDone = Ledger.Event<"TodoItemDone", Pick<Item, "id">, Auditor>;
export type ItemUndone = Ledger.Event<"TodoItemUndone", Pick<Item, "id">, Auditor>;
export type ItemRemoved = Ledger.Event<"TodoItemRemoved", Pick<Item, "id">, Auditor>;

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
