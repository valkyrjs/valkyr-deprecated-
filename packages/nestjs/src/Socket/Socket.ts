import { WebSocket } from "ws";

export type Socket = WebSocket & {
  id: string;
  channels: Set<string>;
  auditor?: string;
};
