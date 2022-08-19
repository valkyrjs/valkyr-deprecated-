import { router } from "@App/Services/Router";
import { Controller } from "@valkyr/router";

import { Realm } from "../Models/Realm";

type RealmState = {
  realm: Realm;
};

export class RealmController extends Controller<RealmState> {
  async resolve(): Promise<void> {
    this.subscription = Realm.subscribe({ id: router.params.get("realm") }, { limit: 1 }, this.setNext("realm"));
  }
}
