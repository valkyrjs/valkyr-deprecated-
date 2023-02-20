import { Controller } from "@valkyr/react";

import { db } from "../Data/Event.Database";
import { EventGroupDocument } from "../Data/EventGroup.Collection";
import { EventGroupForm } from "../Library/EventGroup.Form";

export class EventsController extends Controller<{
  groups: EventGroupDocument[];
  form: EventGroupForm;
}> {
  async onInit() {
    return {
      groups: await this.query(db.collection("groups"), { sort: { name: 1 } }, "groups"),
      form: new EventGroupForm({ name: "" })
    };
  }
}
