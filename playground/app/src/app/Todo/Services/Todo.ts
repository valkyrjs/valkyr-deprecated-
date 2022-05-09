import { Injectable } from "@angular/core";
import { LedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { TodoStore } from "stores";

@Injectable()
export class TodoService {
  constructor(private ledger: LedgerService) {}

  public async create(workspaceId: string, name: string, auditor: string) {
    const event = TodoStore.events.created(generateStreamId(), { workspaceId, name }, { auditor });
    this.ledger.append(event);
    this.ledger.relay("workspace", workspaceId, event);
  }
}
