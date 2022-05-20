import { Aggregate, AggregateRoot } from "@valkyr/ledger";

import { ComponentKind, ComponentSettings, Layouts } from "../Types";
import { Member, Workspace } from "../Workspace";
import { EventRecord } from "./Events";

export type TemplateComponent = {
  id: string;
  kind: ComponentKind;
  layouts: Layouts;
  settings: Partial<ComponentSettings>;
};

export type State = {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  color: string;
  createdBy: Member["id"];
  createdAt: string;
  updatedBy?: Member["id"];
  updatedAt?: string;
};

export class Template extends AggregateRoot {
  public id = "";
  public workspaceId = "";
  public name = "";
  public color = "";
  public components = new Components(this);
  public createdBy = "";
  public createdAt = "";
  public updatedBy?: Member["id"];
  public updatedAt?: string;

  public apply(event: EventRecord) {
    switch (event.type) {
      case "TemplateCreated": {
        this.id = event.streamId;
        this.workspaceId = event.data.workspaceId;
        this.name = event.data.name;
        this.color = event.data.color;
        break;
      }
      case "TemplateNameSet": {
        this.name = event.data.name;
        break;
      }
      case "TemplateComponentAdded": {
        this.components.add({
          id: event.data.id,
          kind: event.data.kind,
          layouts: event.data.layouts,
          settings: event.data.settings
        });
        break;
      }
      case "TemplateComponentSettingSet": {
        const component = this.components.get(event.data.id);
        if (component) {
          const { id, ...settings } = event.data;
          this.components.update(id, {
            settings: {
              ...component.settings,
              ...settings
            }
          });
        }
        break;
      }
      case "TemplateComponentLayoutSet": {
        const component = this.components.get(event.data.id);
        if (component) {
          const { id, ...layouts } = event.data;
          this.components.update(id, {
            layouts: {
              ...component.layouts,
              ...layouts
            }
          });
        }
        break;
      }
      case "TemplateComponentRemoved": {
        console.log(event);
        this.components.remove(event.data.id);
        break;
      }
      case "TemplateRemoved": {
        break;
      }
    }
  }

  public toJSON(): State {
    return {
      id: this.id,
      workspaceId: this.workspaceId,
      name: this.name,
      color: this.color,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedBy: this.updatedBy,
      updatedAt: this.updatedAt
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregates
 |--------------------------------------------------------------------------------
 */

class Components extends Aggregate<Template, TemplateComponent> {}
