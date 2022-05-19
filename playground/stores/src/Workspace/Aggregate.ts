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
  name: string;
  publicKey: string;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Workspace extends Ledger.AggregateRoot {
  id = "";
  name = "";
  invites = new Invites(this);
  members = new Members(this);

  apply(event: Event): void {
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

  toJSON(): State {
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
  getByEmail(email: string) {
    return this.index.find((invite) => invite.email === email);
  }
}

class Members extends Ledger.Aggregate<Workspace, Member> {
  getById(id: string) {
    return this.get(id);
  }
}
