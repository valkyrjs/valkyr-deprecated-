import { WebSocket } from "ws";

import { IdentitySignature } from "../Decorators";

export type Socket = WebSocket & {
  id: string;
  channels: Set<string>;
  signature?: IdentitySignature;
};
