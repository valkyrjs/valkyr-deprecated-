import { Collection, Model } from "@valkyr/db";
import { ledger } from "@valkyr/ledger-client";
import { uuid } from "@valkyr/utils";
import { events, Member, Workspace as WorkspaceAttributes } from "stores";

import { adapter } from "../Providers/IdbAdapter";

type Attributes = WorkspaceAttributes;

export class Workspace extends Model<Attributes> {
  public static readonly $collection = new Collection<Attributes>("workspaces", adapter);

  public readonly name: Attributes["name"];
  public readonly members: Members;

  constructor(document: Attributes) {
    super(document);

    this.name = document.name;
    this.members = new Members(this, document.members);

    Object.freeze(this);
  }

  public static create(name: string, accountId: string) {
    ledger.push(events.workspace.created(uuid(), { name }, { auditor: accountId }));
  }

  public toJSON(): Attributes {
    return super.toJSON({
      name: this.name,
      members: this.members.toJSON()
    });
  }
}

class Members {
  constructor(public readonly workspace: Workspace, public readonly members: Member[]) {}

  public async add(accountId: string, auditor: string) {
    const hasMember = this.members.find((member) => member.accountId === accountId);
    if (hasMember !== undefined) {
      throw new Error(`Workspace Member Violation: Account ${accountId} is already a member of this workspace.`);
    }
    ledger.push(
      events.workspace.member.added(
        this.workspace.id,
        {
          id: uuid(),
          accountId
        },
        {
          auditor
        }
      )
    );
  }

  public get(id: string) {
    return this.members.find((member) => member.id === id);
  }

  public async remove(id: string, auditor: string) {
    ledger.push(events.workspace.member.removed(this.workspace.id, { id }, { auditor }));
  }

  public toJSON(): Member[] {
    return this.members;
  }
}
