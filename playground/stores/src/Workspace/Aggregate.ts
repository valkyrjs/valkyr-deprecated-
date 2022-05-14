import { Ledger } from "@valkyr/ledger";

import { Event } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type State = {
  id: string;
  name: string;
  invites: Invite[];
  members: Member[];
};

export type Invite = {
  id: string;
  email: string;
};

export type Member = {
  id: string;
  accountId: string;
  name: string;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Workspace extends Ledger.AggregateRoot {
  public id = "";
  public name = "";
  public invites = new Invites(this);
  public members = new Members(this);

  public apply(event: Event): void {
    switch (event.type) {
      case "WorkspaceCreated": {
        this.id = event.streamId;
        this.name = event.data.name;
        for (const member of event.data.members) {
          this.members.add(member);
        }
        break;
      }
      case "WorkspaceInviteCreated": {
        this.invites.add(event.data);
        break;
      }
      case "WorkspaceInviteRemoved": {
        this.invites.remove(event.data);
        break;
      }
    }
  }

  public toJSON(): State {
    return {
      id: this.id,
      name: this.name,
      invites: this.invites.toJSON(),
      members: this.members.toJSON()
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregates
 |--------------------------------------------------------------------------------
 */

class Invites extends Ledger.Aggregate<Workspace, Invite> {
  public getByEmail(email: string) {
    return this.index.find((invite) => invite.email === email);
  }
}

class Members extends Ledger.Aggregate<Workspace, Member> {
  public getAccountIds() {
    return this.index.map((member) => member.accountId);
  }

  public getByAccount(id: string) {
    return this.index.find((member) => member.accountId === id);
  }

  public getByMember(id: string) {
    return this.get(id);
  }
}
