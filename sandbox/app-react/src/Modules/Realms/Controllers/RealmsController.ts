import { faker } from "@faker-js/faker";
import { Controller } from "@valkyr/router";

import { Realm } from "../Models/Realm";

type RealmsState = {
  realms: Realm[];
};

export class RealmsController extends Controller<RealmsState> {
  static state: RealmsState = {
    realms: []
  };

  /*
   |--------------------------------------------------------------------------------
   | Resolvers
   |--------------------------------------------------------------------------------
   */

  async resolve() {
    this.subscription = Realm.subscribe({}, {}, this.setNext("realms"));
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Add a new fake realm to the realms collection.
   */
  async addRealm() {
    await Realm.insertOne({
      name: faker.company.name(),
      color: faker.color.rgb(),
      icon: faker.random.alpha(),
      members: [],
      invites: [],
      owner: faker.random.alphaNumeric()
    });
  }

  /**
   * Clear all documents stored in the realms collection.
   */
  async clearRealms() {
    await Realm.remove({});
  }
}
