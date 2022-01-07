/* eslint-disable */

/*

  Stores

  The following is an auto generated index.ts file which contains the results of
  traversing the stores folder and outputting its resources depending on folder
  and file naming structures.

  This file will override any manual changes made here, so no need to edit!
  
 */

/*
 |--------------------------------------------------------------------------------
 | Access
 |--------------------------------------------------------------------------------
 */

import { access as accountAccess } from "./Account/Access";

export const access = {
  account: accountAccess
};

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

import {
  AccountCreated,
  AccountActivated,
  AccountAliasSet,
  AccountNameSet,
  AccountEmailSet,
  AccountClosed,
  events as accountEvents
} from "./Account/Events";

export type Event =
  | AccountCreated
  | AccountActivated
  | AccountAliasSet
  | AccountNameSet
  | AccountEmailSet
  | AccountClosed;

export {
  AccountCreated,
  AccountActivated,
  AccountAliasSet,
  AccountNameSet,
  AccountEmailSet,
  AccountClosed
};

export const events = {
  account: accountEvents
};


/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export * from "./Account";
