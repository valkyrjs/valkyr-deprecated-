import { Collection, Model } from "@valkyr/db";
import { ledger } from "@valkyr/ledger-client";
import { nanoid } from "@valkyr/utils";
import { Member, Workspace as WorkspaceAttributes, workspace } from "stores";

import { adapter } from "../Providers/IdbAdapter";
import { remote } from "../Remote";

type Attributes = WorkspaceAttributes;

/*
 |--------------------------------------------------------------------------------
 | Workspace
 |--------------------------------------------------------------------------------
 */

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

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Create a new workspace with an initial member connected to a valid account.
   *
   * @param name      - Name of the workspace.
   * @param accountId - Account id to assign as initial member.
   */
  public static create(name: string, accountId: string) {
    const member: Member = {
      id: nanoid(),
      accountId,
      name: ""
    };
    ledger.push(workspace.created(nanoid(), { name, members: [member] }, { auditor: member.id }));
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): Attributes {
    return super.toJSON({
      name: this.name,
      members: this.members.toJSON()
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Members
 |--------------------------------------------------------------------------------
 */

class Members {
  constructor(public readonly workspace: Workspace, public readonly members: Member[]) {}

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Send a member invite to the provided email.
   *
   * @param email - Email to send invite to.
   */
  public async invite(email: string) {
    return remote.post(`/workspaces/${this.workspace.id}/invite`, { email });
  }

  /**
   * Remove a member from the parent workspace.
   *
   * @param id      - Identifier of the member being removed.
   * @param auditor - Member who is removing the member.
   */
  public async remove(id: string, auditor: string) {
    ledger.push(workspace.member.removed(this.workspace.id, { id }, { auditor }));
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  /**
   * Get a member from the members array.
   *
   * @param id - Identifier of the member.
   *
   * @returns Member details if exists
   */
  public get(id: string) {
    return this.members.find((member) => member.id === id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): Member[] {
    return this.members;
  }
}
