import { ledger } from "@valkyr/client";
import { Collection, Document, Model } from "@valkyr/db";
import { Account as Acct, account } from "stores";

import { adapter } from "../Providers/IdbAdapter";

type Attributes = Document & {
  name?: Acct.State["name"];
  email: Acct.State["email"];
};

export class Account extends Model<Attributes> {
  public static readonly $collection = new Collection<Attributes>("accounts", adapter);

  public readonly name: Attributes["name"];
  public readonly email: Attributes["email"];

  constructor(document: Attributes) {
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

  public setName(name: Attributes["name"]) {
    if (name.given === this.name?.given && name.family === this.name?.family) {
      return console.info("Name has not changed, skipping...");
    }
    ledger.push(account.nameSet(this.id, { name }));
  }

  public setEmail(email: string) {
    if (email === this.email) {
      return console.info("Email has not changed, skipping...");
    }
    ledger.push(account.emailSet(this.id, { email }));
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): Attributes {
    return super.toJSON({
      name: this.name,
      email: this.email
    });
  }
}
