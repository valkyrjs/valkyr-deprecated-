import type { Event } from "@valkyr/ledger";

import { container } from "./Container";

export const db = {
  get events() {
    return container.get("Database").collection<Event>("events");
  },

  /**
   * Provide all the events for the entire ledger.
   *
   * @param created   - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   *
   * @returns Events in the ledger
   */
  async getEvents(created?: string, direction?: 1 | -1) {
    const filter: any = {};
    if (created) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: created
      };
    }
    return db.events.find(filter).sort("created").toArray();
  },

  /**
   * Provide all the events for a given stream.
   *
   * @param streamId  - Stream identifier to retrieve events from.
   * @param created   - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   *
   * @returns Events found for the given stream
   */
  async getStream(streamId: string, created?: string, direction: 1 | -1 = 1) {
    const filter: any = { streamId };
    if (created) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: created
      };
    }
    return db.events.find(filter).sort({ created: direction }).toArray();
  },

  async getRecorded(streamId: string, recorded?: string) {
    const filter: any = { streamId };
    if (recorded) {
      filter.recorded = {
        $gt: recorded
      };
    }
    return db.events.find(filter).sort({ recorded: 1 }).toArray();
  }
};
