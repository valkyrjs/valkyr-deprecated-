import { router } from "@App/Services/Router";
import { Controller, ReactViewController } from "@valkyr/mvc";

import { Realm } from "../Models/Realm";

export class RealmController extends Controller<{
  realm?: Realm;
}> {
  async resolve(): Promise<void> {
    this.subscriptions.realm = Realm.subscribe({ id: router.params.get("realm") }, { limit: 1 }, this.setNext("realm"));
  }
}

export const view = new ReactViewController(RealmController);
