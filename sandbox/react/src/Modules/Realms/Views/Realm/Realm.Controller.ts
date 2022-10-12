import { router } from "@App/Services/Router";
import { Controller, ViewController } from "@valkyr/react";

import { Realm } from "../../Models/Realm";

/*
 |--------------------------------------------------------------------------------
 | Controller
 |--------------------------------------------------------------------------------
 */

export class RealmController extends Controller<State> {
  async onResolve(): Promise<State> {
    return {
      realm: await this.query(
        Realm,
        {
          where: {
            id: router.params.get("realm")
          },
          limit: 1
        },
        "realm"
      )
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type State = {
  realm?: Realm;
};

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const controller = new ViewController(RealmController);
