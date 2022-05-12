import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { TodoStore } from "stores";

import { TodoItemSubscriberService } from "./TodoItemSubscriber";

@Injectable()
export class TodoItemService extends DataSubscriber {
  constructor(readonly ledger: LedgerService, readonly subscriber: TodoItemSubscriberService) {
    super();
  }

  public async create(todoId: string, text: string, auditor: string) {
    this.ledger.append(TodoStore.events.item.added(todoId, { id: generateStreamId(), text }, { auditor }));
  }

  public async move(todoId: string, id: string, sort: number, auditor: string) {
    return this.ledger.append(TodoStore.events.item.sortSet(todoId, { id, sort }, { auditor }));
  }
}
