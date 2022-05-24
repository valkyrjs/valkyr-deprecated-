import { Document, Model } from "@valkyr/db";
import { WorkspaceStore } from "stores";

export type WorkspaceDocument = Document & {
  name: string;
  color: string;
  invites: WorkspaceStore.State["invites"];
  members: WorkspaceStore.State["members"];
};

export class Workspace extends Model<WorkspaceDocument> {
  public readonly name!: WorkspaceDocument["name"];
  public readonly color!: WorkspaceDocument["color"];
  public readonly invites: Invites;
  public readonly members: Members;

  constructor(document: WorkspaceDocument) {
    super(document);

    this.invites = new Invites(this, document.invites);
    this.members = new Members(this, document.members);

    Object.freeze(this);
  }
}

export type WorkspaceModel = typeof Workspace;

/*
 |--------------------------------------------------------------------------------
 | Members
 |--------------------------------------------------------------------------------
 */

class Invites {
  constructor(public readonly workspace: Workspace, public readonly invites: WorkspaceStore.Invite[]) {}

  public get size() {
    return this.invites.length;
  }

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

  public get size() {
    return this.members.length;
  }

  public getAll() {
    return this.members;
  }

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

  /**
   * Get a member from the members array by the assigned account id.
   *
   * @param id - Id to find the member for.
   *
   * @returns Member details if exists
   */
  public getById(id: string) {
    return this.members.find((member) => member.id === id);
  }
}
