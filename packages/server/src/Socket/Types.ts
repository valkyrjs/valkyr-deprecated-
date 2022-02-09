/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

export type MessageBody = {
  uuid: string;
  type: string;
  data: Record<string, unknown>;
};

export type ValidatedMessage = {
  uuid: string;
  type: string;
  data?: Record<string, unknown>;
};
