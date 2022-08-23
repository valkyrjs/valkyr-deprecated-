import { faker } from "@faker-js/faker";
import { Controller, ReactViewController } from "@valkyr/mvc";

import { Realm } from "../Models/Realm";

type State = {
  realms: Realm[];
};

type Props = {
  name: string;
};

type Filter = {
  name?:
    | string
    | {
        $regex: RegExp;
      };
};

export class RealmsController extends Controller<State, Props> {
  static readonly state: State = {
    realms: []
  };

  #name: string;
  #filter: Filter = {};
  #sort: -1 | 1 = 1;

  /*
   |--------------------------------------------------------------------------------
   | Options
   |--------------------------------------------------------------------------------
   */

  async filter(value: string) {
    if (value === "") {
      this.#filter = {};
    } else {
      this.#filter = {
        name: {
          $regex: new RegExp(value, "i")
        }
      };
    }
    this.resolve();
  }

  async toggle() {
    this.#sort = this.#sort === 1 ? -1 : 1;
    this.resolve();
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolvers
   |--------------------------------------------------------------------------------
   */

  async resolve({ name }: Props = { name: this.#name }) {
    this.#name = name; // set name provided through external properties

    // ### Subscribe
    // Subscribe to realms through the @valkyr/db subscription method.

    this.subscriptions.realms?.unsubscribe();
    this.subscriptions.realms = Realm.subscribe(
      this.#filter,
      {
        sort: {
          name: this.#sort
        }
      },
      this.setNext("realms")
    );
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Add a new fake realm to the realms collection.
   */
  async addRealm(amount = 1) {
    while (amount > 0) {
      Realm.insertOne({
        name: faker.company.name(),
        color: faker.color.rgb(),
        icon: faker.random.alpha(),
        members: [],
        invites: [],
        owner: faker.random.alphaNumeric()
      });
      amount -= 1;
    }
  }

  /**
   * Delete a realm from the realms collection.
   *
   * @param id - Realm id.
   */
  async deleteRealm(id: string) {
    return Realm.remove({ id });
  }

  /**
   * Clear all documents stored in the realms collection.
   */
  async clearRealms() {
    await Realm.remove({});
  }
}

export const controller = new ReactViewController(RealmsController);
