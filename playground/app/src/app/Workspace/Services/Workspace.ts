import { Injectable } from "@angular/core";
import { AuthGunService, DataSubscriber, GunLedgerService } from "@valkyr/angular";
import { generateStreamId } from "@valkyr/ledger";
import { WorkspaceStore } from "stores";

import { WorkspaceSubscriberService } from "./WorkspaceSubscriber";

@Injectable({ providedIn: "root" })
export class WorkspaceService extends DataSubscriber {
  #selected?: string;

  constructor(
    readonly subscriber: WorkspaceSubscriberService,
    readonly ledger: GunLedgerService,
    readonly auth: AuthGunService
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
    const member: WorkspaceStore.Member = {
      id: generateStreamId(),
      accountId: this.auth.id,
      name: ""
    };
    this.ledger.append(
      WorkspaceStore.events.created(generateStreamId(), { name, members: [member] }, { auditor: member.id })
    );
  }
}
