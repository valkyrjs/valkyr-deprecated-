import type { WebSocket } from "ws";

export type Channels = Map<string, Set<WebSocket>>;
