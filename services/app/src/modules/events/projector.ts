import { ledger } from "@valkyr/app";

import { db } from "~services/database";
import { UserCreated } from "~stores/user";

ledger.projector.on<UserCreated>("UserCreated", async ({ stream, data: { name, email }, created }) => {
  await db.collection("users").insertOne({
    id: stream,
    name,
    email,
    posts: 0,
    createdAt: created
  });
});
