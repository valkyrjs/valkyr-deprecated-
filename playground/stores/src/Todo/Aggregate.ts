import { Aggregate, AggregateRoot } from "@valkyr/ledger";

import { Member, Workspace } from "../Workspace";
import { EventRecord } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type State = {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  sort?: number;
};

export type Item = {
  id: string;
  isDone: boolean;
  text: string;
  assignedTo?: Member["id"];
  sort?: number;
  createdBy: Member["id"];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Todo extends AggregateRoot {
  public id = "";
  public workspaceId = "";
  public name = "";
  public sort: number | undefined = undefined;
  public items = new Items(this);

  public apply(event: EventRecord) {
    switch (event.type) {
      case "TodoCreated": {
        this.id = event.streamId;
        this.workspaceId = event.data.workspaceId;
        this.name = event.data.name;
        break;
      }
      case "TodoSortSet": {
        this.sort = event.data.sort;
        break;
      }
      case "TodoItemAdded": {
        this.items.add({
          id: event.data.id,
          isDone: false,
          text: event.data.text,
          createdBy: event.meta.auditor,
          createdAt: event.created
        });
        break;
      }
      case "TodoItemTextSet": {
        this.items.update(event.data.id, {
          text: event.data.text,
          updatedAt: event.created
        });
        break;
      }
      case "TodoItemSortSet": {
        this.items.update(event.data.id, {
          sort: event.data.sort,
          updatedAt: event.created
        });
        break;
      }
      case "TodoItemDone": {
        this.items.update(event.data.id, {
          isDone: true,
          updatedAt: event.created,
          completedAt: event.created
        });
        break;
      }
      case "TodoItemUndone": {
        this.items.update(event.data.id, {
          isDone: false,
          updatedAt: event.created,
          completedAt: undefined
        });
        break;
      }
      case "TodoItemRemoved": {
        this.items.remove(event.data.id);
        break;
      }
    }
  }

  public toJSON(): State {
    return {
      id: this.id,
      workspaceId: this.workspaceId,
      name: this.name,
      sort: this.sort
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregates
 |--------------------------------------------------------------------------------
 */

class Items extends Aggregate<Todo, Item> {}
