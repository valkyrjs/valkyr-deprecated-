import { resolve } from "./features/auth/auth";
import { socket } from "./providers/socket";

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
  await Promise.all([import("./providers/auth"), import("./providers/entityStream")]);
}

async function event() {
  await Promise.all([import("./projections/account")]);
}

async function auth() {
  const token = localStorage.getItem("token");
  if (token) {
    await resolve(token);
  }
}
