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

eventStore.projector.on("TodoItemCompleted", async ({ stream }) => {
  await db.collection("todos").updateOne({ id: stream }, { $set: { completed: true } });
});

eventStore.projector.on("TodoItemUncompleted", async ({ stream }) => {
  await db.collection("todos").updateOne({ id: stream }, { $set: { completed: false } });
});

eventStore.projector.on("TodoItemArchived", async ({ stream }) => {
  await db.collection("todos").remove({ id: stream });
});
