import { resolve } from "./features/Auth/Auth";
import { socket } from "./providers/Socket";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

export async function setup(): Promise<void> {
  await socket.connect();
  await dependencies();
  await event();
  await auth();
}

async function dependencies(): Promise<void> {
  await Promise.all([import("./providers/Auth"), import("./providers/EntityStream")]);
}

async function event() {
  await Promise.all([import("./projections/Account")]);
}

async function auth() {
  const token = localStorage.getItem("token");
  if (token) {
    await resolve(token);
  }
}
