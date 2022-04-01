import { AggregateRoot } from "@valkyr/ledger";

import { AccountEvent } from "./Events";

/*
 |--------------------------------------------------------------------------------
 | State
 |--------------------------------------------------------------------------------
 */

export type AccountState = {
  id: string;
  status: Status;
  name: Name;
  alias: string;
  email: string;
};

type Status = "onboarding" | "active" | "closed";

type Name = {
  family: string;
  given: string;
};

/*
 |--------------------------------------------------------------------------------
 | Aggregate Root
 |--------------------------------------------------------------------------------
 */

export class Account extends AggregateRoot {
  public id = "";
  public status: Status = "onboarding";
  public name: Name = {
    family: "",
    given: ""
  };
  public alias = "";
  public email = "";

  public apply(event: AccountEvent): void {
    switch (event.type) {
      case "AccountCreated": {
        this.id = event.streamId;
        this.email = event.data.email;
        break;
      }
      case "AccountActivated": {
        this.status = "active";
        break;
      }
      case "AccountAliasSet": {
        this.alias = event.data.alias;
        break;
      }
      case "AccountNameSet": {
        this.name = event.data.name;
        break;
      }
      case "AccountEmailSet": {
        this.email = event.data.email;
        break;
      }
      case "AccountClosed": {
        this.status = "closed";
        break;
      }
    }
  }

  public toJSON(): AccountState {
    return {
      id: this.id,
      status: this.status,
      name: this.name,
      alias: this.alias,
      email: this.email
    };
  }
}
