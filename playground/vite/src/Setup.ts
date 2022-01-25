import { resolve } from "./Auth";
import { socket } from "./Providers/Socket";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

export async function setup(): Promise<void> {
  await socket.connect();
  await dependencies();
  await event();
  await routes();
  await auth();
}

async function dependencies(): Promise<void> {
  await Promise.all([import("./Providers/Auth"), import("./Providers/EntityStream")]);
}

async function event() {
  await Promise.all([import("./Projections/Account")]);
}

async function routes() {
  await Promise.all([import("./Router/Routes")]);
}

async function auth() {
  const token = localStorage.getItem("token");
  if (token) {
    await resolve(token);
  }
}
