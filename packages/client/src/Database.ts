import { Adapter } from "@valkyr/db";

import { container } from "./Container";

export const database: Adapter = {
  get set() {
    return container.get("Database").set.bind(container.get("Database"));
  },
  get get() {
    return container.get("Database").get.bind(container.get("Database"));
  },
  get del() {
    return container.get("Database").del.bind(container.get("Database"));
  },
  get flush() {
    return container.get("Database").flush.bind(container.get("Database"));
  }
};
