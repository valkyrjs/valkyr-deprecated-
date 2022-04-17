import { ledger, remote } from "@valkyr/client";
import { Collection, Model } from "@valkyr/db";
import { nanoid } from "@valkyr/utils";
import { WorkspaceStore } from "stores";

import { adapter } from "../Adapter";

type Attributes = {
  id: WorkspaceStore.State["id"];
  name: WorkspaceStore.State["name"];
  invites?: WorkspaceStore.State["invites"];
  members: WorkspaceStore.State["members"];
};

/*
 |--------------------------------------------------------------------------------
 | Workspace
 |--------------------------------------------------------------------------------
 */

export class Workspace extends Model<Attributes> {
  public static readonly $collection = new Collection<Attributes>("workspaces", adapter);

  public readonly name: Attributes["name"];
  public readonly invites: Invites;
  public readonly members: Members;

  constructor(document: Attributes) {
    super(document);

    this.name = document.name;
    this.invites = new Invites(this, document.invites ?? []);
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
    const member: WorkspaceStore.Member = {
      id: nanoid(),
      accountId,
      name: ""
    };
    ledger.push(WorkspaceStore.events.created(nanoid(), { name, members: [member] }, { auditor: member.id }));
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

class Invites {
  constructor(public readonly workspace: Workspace, public readonly invites: WorkspaceStore.Invite[]) {}

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get size() {
    return this.invites.length;
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Create a new workspace invite for the given email.
   *
   * @param email - Email to send invite to.
   */
  public async create(email: string) {
    return remote.post(`/workspaces/${this.workspace.id}/invites`, { email });
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  public getAll() {
    return this.invites;
  }

  public get(id: string) {
    return this.invites.find((invite) => invite.id === id);
  }

  public getByEmail(email: string) {
    return this.invites.find((invite) => invite.email === email);
  }
}

class Members {
  constructor(public readonly workspace: Workspace, public readonly members: WorkspaceStore.Member[]) {}

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  public get size() {
    return this.members.length;
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Remove a member from the parent workspace.
   *
   * @param id      - Identifier of the member being removed.
   * @param auditor - Member who is removing the member.
   */
  public async remove(id: string, auditor: string) {
    ledger.push(WorkspaceStore.events.member.removed(this.workspace.id, { id }, { auditor }));
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

  public toJSON(): WorkspaceStore.Member[] {
    return this.members;
  }
}
