import { AggregateRoot } from "@valkyr/ledger";

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
        this.members.add(event.data.members);
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

class Members {
  public members: Member[] = [];

  public add(members: Member[]) {
    for (const member of members) {
      this.members.push(member);
    }
  }

  public getAccountIds() {
    return this.members.map((member) => member.accountId);
  }

  public getByAccount(id: string) {
    return this.members.find((member) => member.accountId === id);
  }

  public getByMember(id: string) {
    return this.members.find((member) => member.id === id);
  }

  public remove(id: string) {
    this.members = this.members.filter((member) => member.id !== id);
  }

  public toJSON() {
    return this.members;
  }
}
