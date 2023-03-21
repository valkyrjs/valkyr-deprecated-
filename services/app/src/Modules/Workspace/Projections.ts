import { eventStore } from "~Services/Ledger/EventStore";

import { db } from "./Database";

eventStore.projector.on("WorkspaceCreated", async (record) => {
  await db.collection("workspaces").insertOne({
    id: record.stream,
    name: record.data.name,
    users: [
      {
        userId: record.meta.auditor,
        name: record.data.user.name
      }
    ]
  });
});
