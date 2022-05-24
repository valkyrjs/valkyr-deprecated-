import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { TodoStore } from "stores";

import { TodoSubscriberService } from "./TodoSubscriber";

@Injectable({ providedIn: "root" })
export class TodoService extends DataSubscriber {
  constructor(readonly ledger: LedgerService, readonly subscriber: TodoSubscriberService) {
    super();
  }

  public async create(workspaceId: string, name: string, auditor: string) {
    this.ledger.append(getId(), TodoStore.events.created({ workspaceId, name }, { auditor }));
  }

  public async move(id: string, sort: number, auditor: string) {
    this.ledger.append(id, TodoStore.events.sortSet({ sort }, { auditor }));
  }
}
