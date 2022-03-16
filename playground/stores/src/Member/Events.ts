import { createEvent, Event } from "@valkyr/ledger";

import type { Account } from "../Account";
import type { Member } from "./Aggregate";
import type { Auditor } from "./Auditor";

export type MemberAdded = Event<"MemberAdded", { accountId: Account["id"] }, Auditor>;
export type MemberRemoved = Event<"MemberRemoved", Pick<Member, "id">, Auditor>;

export const events = {
  added: createEvent<MemberAdded>("MemberAdded"),
  removed: createEvent<MemberRemoved>("MemberRemoved")
};