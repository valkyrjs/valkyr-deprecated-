import { Controller } from "@valkyr/react";

import { EventDocument } from "../Data/Event.Collection";
import { db } from "../Data/Event.Database";

export class EventListController extends Controller<
  {
    events: EventDocument[];
  },
  {
    groupId: string;
  }
> {
  async onInit() {
    return {
      events: await this.query(
        db.collection("events"),
        { where: { groupId: this.props.groupId }, sort: { "$meta.createdAt": 1 } },
        "events"
      )
    };
  }
}
