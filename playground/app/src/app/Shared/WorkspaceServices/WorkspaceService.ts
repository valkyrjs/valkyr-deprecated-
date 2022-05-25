import { Injectable } from "@angular/core";
import { AuthService, DataSubscriber, LedgerService } from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { WorkspaceStore } from "stores";

import { WorkspaceSubscriberService } from "./WorkspaceSubscriberService";

@Injectable({ providedIn: "root" })
export class WorkspaceService extends DataSubscriber {
  #selected?: string;

  constructor(
    readonly subscriber: WorkspaceSubscriberService,
    readonly ledger: LedgerService,
    readonly auth: AuthService
  ) {
    super();
  }

  set selected(id: string | undefined) {
    this.#selected = id;
  }

  get selected(): string | undefined {
    return this.#selected;
  }

  isActive(workspaceId: string): boolean {
    return this.#selected === workspaceId;
  }

  async create(name: string) {
    const user = await this.auth.getUser();
    const workspaceId = getId();
    const member: WorkspaceStore.Member = {
      id: user.id,
      name: user.data["name"] as string,
      keys: user.publicKeys
    };
    this.ledger.append(workspaceId, WorkspaceStore.events.created({ name, members: [member] }, { auditor: member.id }));
  }
}
