import { Injectable } from "@angular/core";
import { AuthService, LedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { WorkspaceStore } from "stores";

@Injectable({
  providedIn: "root"
})
export class WorkspaceService {
  constructor(private ledger: LedgerService, private auth: AuthService) {}

  async create(name: string) {
    const member: WorkspaceStore.Member = {
      id: generateStreamId(),
      accountId: this.auth.auditor,
      name: ""
    };
    this.ledger.append(
      WorkspaceStore.events.created(generateStreamId(), { name, members: [member] }, { auditor: member.id })
    );
  }
}
