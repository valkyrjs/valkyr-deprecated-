import { Ledger } from "@valkyr/ledger";

import { Template } from "../Template";
import { Workspace } from "../Workspace";
import { Event } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type State = {
  id: string;
  workspaceId: Workspace["id"];
  templateId: Template["id"];
  name: string;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Item extends Ledger.AggregateRoot {
  public id = "";
  public workspaceId = "";
  public templateId = "";
  public name = "";

  public apply(event: Event) {
    switch (event.type) {
      case "ItemCreated": {
        this.id = event.streamId;
        this.workspaceId = event.data.workspaceId;
        this.templateId = event.data.templateId;
        this.name = event.data.name;
        break;
      }
      case "ItemNameSet": {
        this.name = event.data.name;
        break;
      }
      case "ItemRemoved": {
        break;
      }
    }
  }

  public toJSON(): State {
    return {
      id: this.id,
      workspaceId: this.workspaceId,
      templateId: this.templateId,
      name: this.name
    };
  }
}
