import { Aggregate, AggregateRoot } from "@valkyr/ledger";

import { Event } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type State = {
  id: string;
  name: string;
  members: Member[];
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

export class Workspace extends AggregateRoot {
  public id = "";
  public name = "";
  public members = new Members();

  public apply(event: Event): void {
    switch (event.type) {
      case "WorkspaceCreated": {
        this.id = event.streamId;
        this.name = event.data.name;
        for (const member of event.data.members) {
          this.members.add(member);
        }
      }
    }
  }

  public toJSON(): State {
    return {
      id: this.id,
      name: this.name,
      members: this.members.toJSON()
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Aggregates
 |--------------------------------------------------------------------------------
 */

class Members extends Aggregate<Member> {
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
