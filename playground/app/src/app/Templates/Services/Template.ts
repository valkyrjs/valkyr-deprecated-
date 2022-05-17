import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { getRandomColor } from "src/app/Services/ThemeService";
import { TemplateStore } from "stores";

import { TemplateSubscriberService } from "./TemplateSubscriber";

@Injectable()
export class TemplateService extends DataSubscriber {
  constructor(readonly ledger: LedgerService, readonly subscriber: TemplateSubscriberService) {
    super();
  }

  public async create(workspaceId: string, name: string, auditor: string) {
    const color = getRandomColor();
    const event = TemplateStore.events.created(getId(), { workspaceId, name, color }, { auditor });
    this.ledger.append(event);
    this.ledger.relay("workspace", workspaceId, event);
  }

  //   public async move(workspaceId: string, id: string, sort: number, auditor: string) {
  //     const event = TodoStore.events.sortSet(id, { sort }, { auditor });
  //     this.ledger.append(event);
  //     this.ledger.relay("workspace", workspaceId, event);
  //   }
}

// public static create(workspaceId: string): string {
//     const name = generate()
//       .raw.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
//       .join(" ");

//     const color = getRandomColor();
//     const id = nanoid();
//     const components = [];

//     ledger.push(template.created(id, { name, color, workspaceId, components }, { auditor: auth.auditor }));
//     return id;
//   }

//   public static remove(templateId: string): void {
//     ledger.push(template.removed(templateId));
//   }

//   public static setName(templateId: string, name: string): void {
//     ledger.push(template.nameSet(templateId, { name }, { auditor: auth.auditor }));
//   }

//   public static addComponent(templateId: string, { id, kind, layouts, settings }): void {
//     ledger.push(template.components.added(templateId, { id, kind, layouts, settings }, { auditor: auth.auditor }));
//   }

//   public static removeComponent(templateId: string, id: string): void {
//     ledger.push(template.components.removed(templateId, { id }, { auditor: auth.auditor }));
//   }

//   public static setComponentLayout(templateId: string, id: string, desktop: Layout): void {
//     ledger.push(template.components.layoutSet(templateId, { id, desktop }, { auditor: auth.auditor }));
//   }

//   public static setComponentSetting(templateId: string, id: string, setting: Partial<ComponentSettings>): void {
//     ledger.push(template.components.settingSet(templateId, { id, setting }, { auditor: auth.auditor }));
//   }
