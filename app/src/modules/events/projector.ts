import { db } from "~services/database";
import { projector } from "~services/ledger";
import { UserCreated } from "~stores/user";

projector.on<UserCreated>("UserCreated", async ({ stream, data: { name, email }, created }) => {
  await db.collection("users").insertOne({
    id: stream,
    name,
    email,
    posts: 0,
    createdAt: created
  });
});
