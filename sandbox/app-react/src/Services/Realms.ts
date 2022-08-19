import { EventRecord } from "@valkyr/ledger";

import { ledger } from "./Ledger";
import { sync } from "./Ledger/Sync";
import { remote } from "./Remote";
import { socket } from "./Socket";

/*
 |--------------------------------------------------------------------------------
 | Realms
 |--------------------------------------------------------------------------------
 */

export const realms = {
  subscribe: subscribeToRealms,
  unsubscribe: unsubscribeFromRealms
};

/*
 |--------------------------------------------------------------------------------
 | Subscribers
 |--------------------------------------------------------------------------------
 */

export async function subscribeToRealms(): Promise<void> {
  await socket.send("realms:subscribe");
  await loadRealmEvents();
}

function unsubscribeFromRealms(): void {
  socket.send("realms:unsubscribe");
}

/*
 |--------------------------------------------------------------------------------
 | Resolver
 |--------------------------------------------------------------------------------
 */

async function loadRealmEvents(): Promise<void> {
  const res = await remote.get<{ realms: string[] }>("/realms");
  if (res.status === "success") {
    await Promise.all(res.resource.realms.map((realmId) => pullRealmEvents(realmId)));
  }
}

async function pullRealmEvents(realmId: string): Promise<void> {
  const res = await remote.get<{ events: EventRecord[] }>(`/realms/${realmId}/events${await ledger.cursors.get(realmId)}`);
  if (res.status === "success" && res.resource.events.length > 0) {
    for (const event of res.resource.events) {
      await ledger.insert(event);
    }
    await sync.setCursor(realmId, ledger.cursors.timestamp(res.resource.events));
  }
}
