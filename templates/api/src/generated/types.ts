/*
  Valkyr Generator

  The following is an auto generated types.ts file which contains the results of
  consuming types configuration and outputting the result to this file.

  See https://docs.valkyrjs.com for more information.

  This file will override any manual changes made here, so no need to edit!
 */

export type Member = {
  id: string;
  accountId: string;
  name: string;
  avatar: string;
  color: string;
  archived: boolean;
};

export type Theme = "light" | "dark";

export type Alignment = "start" | "center" | "end";

export type Align = {
  x: Alignment;
  y: Alignment;
};
