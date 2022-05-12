import { Injectable } from "@angular/core";
import { DataSubscriber, GunLedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { TodoStore } from "stores";

import { TodoSubscriberService } from "./TodoSubscriber";

@Injectable()
export class TodoService extends DataSubscriber {
  constructor(readonly ledger: GunLedgerService, readonly subscriber: TodoSubscriberService) {
    super();
  }

  public async create(workspaceId: string, name: string, auditor: string) {
    const event = TodoStore.events.created(generateStreamId(), { workspaceId, name }, { auditor });
    this.ledger.append(event);
  }
}
