import { LedgerService } from "@valkyr/client";
import { Collection, Document, Model } from "@valkyr/db";
import { AccountStore } from "stores";

import { app } from "~App";
import { adapter } from "~Library/Adapter";

type AccountDocument = Document & {
  name?: AccountStore.State["name"];
  email: AccountStore.State["email"];
};

export class Account extends Model<AccountDocument> {
  public static readonly $collection = new Collection<AccountDocument>("accounts", adapter);

  public readonly name: AccountDocument["name"];
  public readonly email: AccountDocument["email"];

  private readonly ledger = app.get(LedgerService);

  constructor(document: AccountDocument) {
    super(document);

    this.name = {
      given: document.name?.given ?? "",
      family: document.name?.family ?? ""
    };
    this.email = document.email;

    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  public setName(name: AccountDocument["name"]) {
    if (name.given === this.name?.given && name.family === this.name?.family) {
      return console.info("Name has not changed, skipping...");
    }
    this.ledger.push(AccountStore.events.nameSet(this.id, { name }));
  }

  public setEmail(email: string) {
    if (email === this.email) {
      return console.info("Email has not changed, skipping...");
    }
    this.ledger.push(AccountStore.events.emailSet(this.id, { email }));
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): AccountDocument {
    return super.toJSON({
      name: this.name,
      email: this.email
    });
  }
}
