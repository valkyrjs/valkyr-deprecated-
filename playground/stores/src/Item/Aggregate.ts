import { AggregateRoot } from "@valkyr/ledger";

import { Member, Workspace } from "../Workspace";
import { EventRecord } from "./Events";

export type ItemState = "not-started" | "in-progress" | "done";

export type State = {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  details: string;
  sort: string;
  state: ItemState;
  assignedTo?: Member["id"];
  createdBy: Member["id"];
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
};

export class Item extends AggregateRoot {
  public id = "";
  public workspaceId = "";
  public name = "";
  public details = "";
  public sort = "";
  public state: ItemState = "not-started";
  public assignedTo = "";
  public createdBy = "";
  public createdAt = "";
  public updatedAt = "";
  public completedAt = "";

  public apply(event: EventRecord) {
    switch (event.type) {
      case "ItemCreated": {
        this.id = event.streamId;
        this.workspaceId = event.data.workspaceId;
        this.name = event.data.name;
        this.state = "not-started";
        this.sort = event.data.sort;
        this.createdBy = event.meta.auditor;
        this.createdAt = event.created;
        break;
      }
      case "ItemSortSet": {
        this.sort = event.data.sort;
        this.updatedAt = event.created;
        break;
      }
      case "ItemStateSet": {
        this.state = event.data.state;
        this.updatedAt = event.created;
        break;
      }
      case "ItemDetailsSet": {
        this.details = event.data.details;
        this.updatedAt = event.created;
        break;
      }
      case "ItemDone": {
        this.state = "done";
        this.updatedAt = event.created;
        this.completedAt = event.created;
        break;
      }
      case "ItemUndone": {
        this.state = "in-progress";
        this.updatedAt = event.created;
        this.completedAt = event.created;
        break;
      }
    }
  }

  public toJSON(): State {
    return {
      id: this.id,
      workspaceId: this.workspaceId,
      name: this.name,
      details: this.details,
      sort: this.sort,
      state: this.state,
      assignedTo: this.assignedTo,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt
    };
  }
}
