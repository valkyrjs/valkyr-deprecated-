import { eventStore } from "~Services/Ledger/EventStore";

import { db } from "./Database";

eventStore.projector.on("TodoItemAdded", async ({ container, stream, data: { description } }) => {
  await db.collection("todos").insertOne({
    id: stream,
    workspaceId: container,
    description,
    completed: false
  });
});
