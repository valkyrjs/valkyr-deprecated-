import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { TodoStore } from "stores";

import { TodoItemSubscriberService } from "./TodoItemSubscriber";

@Injectable()
export class TodoItemService extends DataSubscriber {
  constructor(readonly ledger: LedgerService, readonly subscriber: TodoItemSubscriberService) {
    super();
  }

  public async create(todoId: string, text: string, auditor: string) {
    this.ledger.append(TodoStore.events.item.added(todoId, { id: getId(), text }, { auditor }));
  }

  public async move(todoId: string, id: string, sort: number, auditor: string) {
    this.ledger.append(TodoStore.events.item.sortSet(todoId, { id, sort }, { auditor }));
  }
}
