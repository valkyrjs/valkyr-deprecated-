import { resolve } from "./Features/Auth/Auth";
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
  await auth();
}

async function dependencies(): Promise<void> {
  await Promise.all([import("./Providers/Auth"), import("./Providers/EntityStream")]);
}

async function event() {
  await Promise.all([import("./Projections/Account")]);
}

async function auth() {
  const token = localStorage.getItem("token");
  if (token) {
    await resolve(token);
  }
}