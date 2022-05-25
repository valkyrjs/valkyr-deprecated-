import { PublicIdentityKeys } from "@valkyr/identity";
import { Aggregate, AggregateRoot } from "@valkyr/ledger";

import { EventRecord } from "./Events";

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
  keys: PublicIdentityKeys;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Workspace extends AggregateRoot {
  id!: string;
  name!: string;
  invites = new Invites(this);
  members = new Members(this);

  apply(event: EventRecord): void {
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

class Invites extends Aggregate<Workspace, Invite> {
  getByEmail(email: string) {
    return this.index.find((invite) => invite.email === email);
  }
}

class Members extends Aggregate<Workspace, Member> {
  getById(id: string) {
    return this.get(id);
  }
}
