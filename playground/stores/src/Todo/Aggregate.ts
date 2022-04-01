import { AggregateRoot } from "@valkyr/ledger";

import { Workspace } from "../Workspace";
import { TodoEvent } from "./Events";

export type TodoState = {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
};

export class Todo extends AggregateRoot {
  public id = "";
  public workspaceId = "";
  public name = "";

  public apply(event: TodoEvent) {
    switch (event.type) {
      case "TodoCreated": {
        this.id = event.streamId;
        this.workspaceId = event.data.workspaceId;
        this.name = event.data.name;
      }
    }
  }

  public toJSON(): TodoState {
    return {
      id: this.id,
      workspaceId: this.workspaceId,
      name: this.name
    };
  }
}
