import { Injectable } from "@angular/core";
import { LedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { TodoStore } from "stores";

@Injectable()
export class TodoItemService {
  constructor(private ledger: LedgerService) {}

  public async create(todoId: string, text: string, auditor: string) {
    this.ledger.push(TodoStore.events.item.added(todoId, { id: generateStreamId(), text }, { auditor }));
  }
}
