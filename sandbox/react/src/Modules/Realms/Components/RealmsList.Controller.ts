import { faker } from "@faker-js/faker";
import { Controller, ViewController } from "@valkyr/react";

import { Realm } from "../Models/Realm";

/*
 |--------------------------------------------------------------------------------
 | Controller
 |--------------------------------------------------------------------------------
 */

export class RealmsListController extends Controller<State, Props> {
  static readonly state: State = {
    realms: []
  };

  #filter: Filter = {};
  #sort: -1 | 1 = 1;

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle
   |--------------------------------------------------------------------------------
   */

  async onInit() {
    return {
      realms: await this.#queryRealms()
    };
  }

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
    this.#queryRealms();
  }

  async toggle() {
    this.#sort = this.#sort === 1 ? -1 : 1;
    this.#queryRealms();
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

  /*
   |--------------------------------------------------------------------------------
   | Subscriptions
   |--------------------------------------------------------------------------------
   */

  async #queryRealms() {
    return this.query(
      Realm,
      {
        where: this.#filter,
        sort: {
          name: this.#sort
        }
      },
      "realms"
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type State = {
  realms: Realm[];
};

export type Props = {
  name: string;
};

type Filter = {
  name?:
    | string
    | {
        $regex: RegExp;
      };
};

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ViewController(RealmsListController);
