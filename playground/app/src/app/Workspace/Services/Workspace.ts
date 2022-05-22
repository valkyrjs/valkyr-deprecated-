import { Injectable } from "@angular/core";
import { DataSubscriber, LedgerService } from "@valkyr/angular";
import { IdentityService } from "@valkyr/identity";
import { getId } from "@valkyr/security";
import { WorkspaceStore } from "stores";

import { WorkspaceSubscriberService } from "./WorkspaceSubscriber";

@Injectable({ providedIn: "root" })
export class WorkspaceService extends DataSubscriber {
  #selected?: string;

  constructor(
    readonly subscriber: WorkspaceSubscriberService,
    readonly ledger: LedgerService,
    readonly identity: IdentityService
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
    const user = this.identity.getSelectedUser();
    if (!user) {
      throw new Error("Workspace Violation: Cannot create workspace, no initial member could be resolved");
    }
    const workspaceId = getId();
    const member: WorkspaceStore.Member = {
      id: user.cid,
      name: user.data["name"] as string,
      publicKey: await this.identity.publicKey()
    };
    this.ledger.append(workspaceId, WorkspaceStore.events.created({ name, members: [member] }, { auditor: member.id }));
  }
}
