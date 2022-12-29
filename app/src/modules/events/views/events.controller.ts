import { Controller, ViewController } from "@valkyr/react";

import { db } from "~services/database";
import { EventRecord, ledger } from "~services/ledger";
import { user } from "~stores/user";

import { getFakeUserData } from "../../database/utils/user.utils";

class EventsController extends Controller<State> {
  async onInit() {
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

export const controller = new ViewController(EventsController);
