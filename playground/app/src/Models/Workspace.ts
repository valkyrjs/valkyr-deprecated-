import { Collection, Model } from "@valkyr/db";
import { uuid } from "@valkyr/utils";
import { events, Workspace as WorkspaceAttributes } from "stores";

import { adapter } from "../Providers/IdbAdapter";
import { push } from "../Providers/Stream";
import { WorkspaceMember } from "./WorkspaceMember";

type Attributes = WorkspaceAttributes;

export class Workspace extends Model<Attributes> {
  public static readonly $name = "workspaces" as const;

  public readonly name: Attributes["name"];

  constructor(document: Attributes) {
    super(document);

    this.name = document.name;

    Object.freeze(this);
  }

  public static create(name: string, accountId: string) {
    push(events.workspace.created(uuid(), { name }, { auditor: accountId }));
  }

  public async addMember(accountId: string, auditor: string) {
    return WorkspaceMember.add(this.id, accountId, auditor);
  }

  public toJSON(): Attributes {
    return super.toJSON({
      name: this.name
    });
  }
}

Collection.create(Workspace, adapter);
