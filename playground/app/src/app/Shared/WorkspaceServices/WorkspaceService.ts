import { Injectable } from "@angular/core";
import {
  AuthService,
  DataSubscriber,
  IdentityStorageService,
  LedgerService,
  RemoteIdentityResponse,
  RemoteService
} from "@valkyr/angular";
import { getId } from "@valkyr/security";
import { WorkspaceStore } from "stores";

import { WorkspaceSubscriberService } from "./WorkspaceSubscriberService";

@Injectable({ providedIn: "root" })
export class WorkspaceService extends DataSubscriber {
  #current?: string;

  constructor(
    readonly subscriber: WorkspaceSubscriberService,
    readonly ledger: LedgerService,
    readonly auth: AuthService,
    readonly remote: RemoteService,
    readonly storage: IdentityStorageService
  ) {
    super();
  }

  set current(id: string | undefined) {
    if (id) {
      localStorage.setItem("workspace:id", id);
    }
    this.#current = id;
  }

  get current(): string | undefined {
    const id = localStorage.getItem("workspace:id");
    if (id && id !== this.#current) {
      this.#current = id;
    }

    return this.#current;
  }

  isActive(workspaceId: string): boolean {
    return this.#current === workspaceId;
  }

  async create(name: string) {
    const user = await this.auth.getUser();
    const workspaceId = getId();
    const member: WorkspaceStore.Member = {
      id: user.id,
      name: user.data["name"] as string,
      keys: user.publicKeys
    };
    await this.ledger.append(
      workspaceId,
      WorkspaceStore.events.created({ name, members: [member] }, { auditor: member.id })
    );
    await user.update({
      $push: {
        "data.workspaces": workspaceId
      }
    });
    await this.storage.update(this.auth.identity, this.auth.access);
    this.current = workspaceId;
  }

  async invite(alias: string) {
    const identity = await this.remote.get<RemoteIdentityResponse>(`/identities/${alias}`);
    if (this.#current && identity) {
      await this.ledger.append(
        this.#current,
        WorkspaceStore.events.invite.created(
          {
            id: identity.id,
            alias: identity.alias,
            signature: identity.signature
          },
          {
            auditor: this.auth.user
          }
        )
      );
    }
  }
}
