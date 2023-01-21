import { EventRecord, ledger } from "@valkyr/app";
import { Controller } from "@valkyr/react";

import { keyboard } from "~services/keyboard";
import { user } from "~stores/user";

import { getFakeUserData } from "../../database/utils/user.utils";

export class EventsController extends Controller<{
  events: EventRecord[];
}> {
  async onInit() {
    this.subscribe(keyboard, async (key) => {
      if (key === "1") {
        console.log("Pressed");
      }
    });
    return {
      events: await this.query(ledger.db.collection("events"), {}, "events")
    };
  }

  async createUser() {
    const userId = crypto.randomUUID();
    const { name, email } = getFakeUserData();
    await ledger.push(userId, user.created({ name, email }, { container: "public" }));
  }
}
