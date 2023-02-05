import { Controller } from "@valkyr/react";

import { EventBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export class ValidatorHeaderController extends Controller<
  {
    name: string;
  },
  {
    eventId?: string;
    open: boolean;
    onRemove: () => void;
  }
> {
  async onResolve() {
    if (this.props.eventId === undefined) {
      return { name: "Validator" };
    }
    await this.query(
      db.collection<EventBlock>("blocks"),
      { where: { id: this.props.eventId }, limit: 1 },
      async (event) => ({
        name: this.#getName(event)
      })
    );
  }

  #getName(event?: EventBlock): string {
    if (event !== undefined) {
      return `${event.name} Validator`;
    }
    return "Validator";
  }
}
