import { Injectable } from "@angular/core";
import { LedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { TodoStore } from "stores";

@Injectable()
export class TodoService {
  constructor(private ledger: LedgerService) {}

  public async create(workspaceId: string, name: string, auditor: string) {
    this.ledger.push(TodoStore.events.created(generateStreamId(), { workspaceId, name }, { auditor }));
  }
}
