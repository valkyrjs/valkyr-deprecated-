import { Controller } from "@valkyr/react";

import { EventBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export class EventsController extends Controller<{
  events: EventBlock[];
}> {
  async onInit() {
    return {
      events: await this.query(db.collection<EventBlock>("blocks"), { where: { type: "event" } }, "events")
    };
  }
}
