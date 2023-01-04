import { Controller } from "@valkyr/react";

import { db } from "~services/database";
import { keyboard } from "~services/keyboard";
import { EventRecord, ledger } from "~services/ledger";
import { user } from "~stores/user";

import { getFakeUserData } from "../../database/utils/user.utils";

export class EventsController extends Controller<State> {
  async onInit() {
    this.subscribe(keyboard, async (key) => {
      if (key === "1") {
        console.log("Pressed");
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      events: await this.query(db.collection("events"), {}, "events")
    };
  }

  async createUser() {
    const userId = crypto.randomUUID();
    const { name, email } = getFakeUserData();
    await ledger.push(userId, user.created({ name, email }));
  }
}

type State = {
  events: EventRecord[];
};
