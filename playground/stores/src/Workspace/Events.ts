import { createEvent, Event as LedgerEvent } from "@valkyr/ledger";

import { Member, State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<Created>("WorkspaceCreated"),
  nameSet: createEvent<NameSet>("WorkspaceNameSet"),
  removed: createEvent<Removed>("WorkspaceRemoved"),
  member: {
    added: createEvent<MemberAdded>("WorkspaceMemberAdded"),
    removed: createEvent<MemberRemoved>("WorkspaceMemberRemoved")
  }
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"WorkspaceCreated", Pick<State, "name" | "members">, Auditor>;
export type NameSet = LedgerEvent<"WorkspaceNameSet", Pick<State, "name">, Auditor>;
export type Removed = LedgerEvent<"WorkspaceRemoved", never, never>;

export type MemberAdded = LedgerEvent<"WorkspaceMemberAdded", Member, Auditor>;
export type MemberRemoved = LedgerEvent<"WorkspaceMemberRemoved", Pick<Member, "id">, Auditor>;

/*
  |--------------------------------------------------------------------------------
  | Event Union
  |--------------------------------------------------------------------------------
  */

export type Event = Created | NameSet | Removed | MemberAdded | MemberRemoved;

/*
  |--------------------------------------------------------------------------------
  | Event Meta
  |--------------------------------------------------------------------------------
  */

export type Auditor = {
  auditor: Member["id"];
};
