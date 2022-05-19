import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { TodoStore } from "stores";

import { TodoSubscriberService } from "./TodoSubscriber";

@Injectable()
export class TodoService extends DataSubscriber {
  constructor(readonly ledger: LedgerService, readonly subscriber: TodoSubscriberService) {
    super();
  }

  public async create(workspaceId: string, name: string, auditor: string) {
    const event = TodoStore.events.created(getId(), { workspaceId, name }, { auditor });
    this.ledger.append(event);
  }

  public async move(workspaceId: string, id: string, sort: number, auditor: string) {
    const event = TodoStore.events.sortSet(id, { sort }, { auditor });
    this.ledger.append(event);
  }
}
