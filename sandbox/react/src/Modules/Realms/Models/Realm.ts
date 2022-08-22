import { Document, Model } from "@valkyr/db";

export type RealmDocument = Document & {
  name: string;
  color: string;
  icon: string;
  members: Member[];
  invites: Invite[];
  owner: string;
};

type Member = {
  id: string;
  accountId: string;
  name: string;
  avatar?: string;
  color: string;
  archived: boolean;
};

type Invite = {
  token: string;
};

export class Realm extends Model<RealmDocument> {
  readonly name!: RealmDocument["name"];
  readonly color!: RealmDocument["color"];
  readonly members: Members;
  readonly invites: Invite[];
  readonly owner!: RealmDocument["owner"];

  constructor(document: RealmDocument) {
    super(document);
    this.members = new Members(document.members);
    Object.freeze(this);
  }
}

export type RealmModel = typeof Realm;

/*
 |--------------------------------------------------------------------------------
 | Members
 |--------------------------------------------------------------------------------
 */

class Members {
  constructor(readonly members: Member[]) {}

  get size() {
    return this.members.length;
  }

  getAll(): Member[] {
    return this.members;
  }

  get(id: string): Member | undefined {
    return this.members.find((member) => member.id === id);
  }

  getById(id: string): Member | undefined {
    return this.members.find((member) => member.id === id);
  }

  getByAccount(id: string): Member | undefined {
    return this.members.find((member) => member.accountId === id);
  }

  toJSON() {
    return this.members;
  }
}
