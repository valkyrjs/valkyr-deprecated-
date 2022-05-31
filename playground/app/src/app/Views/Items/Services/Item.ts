import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { ItemStore } from "stores";

import { ItemSubscriberService } from "./ItemSubscriber";

@Injectable({ providedIn: "root" })
export class ItemService extends DataSubscriber {
  constructor(readonly ledger: LedgerService, readonly subscriber: ItemSubscriberService) {
    super();
  }

  public async create(workspaceId: string, name: string, auditor: string) {
    const state = "not-started";
    const details = "";
    this.ledger.append(getId(), ItemStore.events.created({ workspaceId, name, details, state }, { auditor }));
  }

  public async move(id: string, sort: number, auditor: string) {
    this.ledger.append(id, ItemStore.events.sortSet({ sort }, { auditor }));
  }
}
