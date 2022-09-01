import { router } from "@App/Services/Router";
import { Controller, ReactViewController } from "@valkyr/mvc";

import { Realm } from "../../Models/Realm";

/*
 |--------------------------------------------------------------------------------
 | Controller
 |--------------------------------------------------------------------------------
 */

export class RealmController extends Controller<{
  realm?: Realm;
}> {
  async resolve(): Promise<void> {
    await this.query("realm", {
      model: Realm,
      where: {
        id: router.params.get("realm")
      },
      limit: 1
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ReactViewController(RealmController);
