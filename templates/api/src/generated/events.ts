/*
  Valkyr Generator

  The following is an auto generated events.ts file which contains the results of
  consuming events configuration and outputting the result to this file.

  See https://docs.valkyrjs.com for more information.

  This file will override any manual changes made here, so no need to edit!
*/

import * as Ledger from "@valkyr/ledger";

import * as Account from "../modules/account/events/account.events";
import * as Type from "./types";

export const event = {
  realmCreated: Ledger.makeEvent<RealmCreated>("RealmCreated"),
  realmNameSet: Ledger.makeEvent<RealmNameSet>("RealmNameSet"),
  realmArchived: Ledger.makeEvent<RealmArchived>("RealmArchived"),
  realmMemberAdded: Ledger.makeEvent<RealmMemberAdded>("RealmMemberAdded"),
  memberArchived: Ledger.makeEvent<MemberArchived>("MemberArchived"),
  memberUnarchived: Ledger.makeEvent<MemberUnarchived>("MemberUnarchived"),
  ...Account.event
} as const;

export type EventFactory = typeof event;

export type RealmCreated = Ledger.Event<
  "RealmCreated",
  Required<{
    name: string;
    color: string;
    icon: string;
    members: Type.Member[];
    owner: string;
  }>,
  Required<{
    container: string;
    auditor: string;
  }>
>;

export type RealmNameSet = Ledger.Event<
  "RealmNameSet",
  Required<{
    name: string;
  }>,
  Required<{
    container: string;
    auditor: string;
  }>
>;

export type RealmArchived = Ledger.Event<
  "RealmArchived",
  {},
  Required<{
    container: string;
    auditor: string;
  }>
>;

export type RealmMemberAdded = Ledger.Event<
  "RealmMemberAdded",
  Required<{
    id: string;
    accountId: string;
    name: string;
    avatar: string;
    color: string;
    archived: boolean;
  }>,
  Required<{
    container: string;
    auditor: string;
  }>
>;

export type MemberArchived = Ledger.Event<
  "MemberArchived",
  Required<{
    id: string;
  }>,
  Required<{
    container: string;
    auditor: string;
  }>
>;

export type MemberUnarchived = Ledger.Event<
  "MemberUnarchived",
  Required<{
    id: string;
  }>,
  Required<{
    container: string;
    auditor: string;
  }>
>;

export type EventRecord =
  | Ledger.EventRecord<RealmCreated>
  | Ledger.EventRecord<RealmNameSet>
  | Ledger.EventRecord<RealmArchived>
  | Ledger.EventRecord<RealmMemberAdded>
  | Ledger.EventRecord<MemberArchived>
  | Ledger.EventRecord<MemberUnarchived>
  | Account.EventRecord;
