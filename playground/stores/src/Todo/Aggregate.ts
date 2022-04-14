import { Aggregate, AggregateRoot } from "@valkyr/ledger";

import { Member, Workspace } from "../Workspace";
import { Event } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type State = {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
};

export type Item = {
  id: string;
  isDone: boolean;
  data: string;
  assignedTo?: Member["id"];
  createdBy?: Member["id"];
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
  public items = new Items(this);

  public apply(event: Event) {
    switch (event.type) {
      case "TodoCreated": {
        this.id = event.streamId;
        this.workspaceId = event.data.workspaceId;
        this.name = event.data.name;
        break;
      }
      case "TodoItemAdded": {
        this.items.add({
          id: event.data.id,
          isDone: false,
          data: event.data.data,
          createdAt: event.created
        });
        break;
      }
      case "TodoItemDataSet": {
        this.items.update(event.data.id, {
          data: event.data.data,
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
      name: this.name
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregates
 |--------------------------------------------------------------------------------
 */

class Items extends Aggregate<Todo, Item> {}
