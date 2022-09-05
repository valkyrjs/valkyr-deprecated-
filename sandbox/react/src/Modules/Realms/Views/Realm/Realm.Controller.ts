import { router } from "@App/Services/Router";
import { Controller, ViewController } from "@valkyr/react";

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
    await this.query(
      Realm,
      {
        where: {
          id: router.params.get("realm")
        },
        limit: 1
      },
      "realm"
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ViewController(RealmController);
