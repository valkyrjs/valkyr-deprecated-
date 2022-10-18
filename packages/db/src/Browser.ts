import { BroadcastChannel } from "broadcast-channel";

import type { Document } from "./Storage";

const channel = new BroadcastChannel<Message>("valkyr:db", { webWorkerSupport: false });

export const browser = {
  get send() {
    return channel.postMessage.bind(channel);
  },

  get addEventListener() {
    return channel.addEventListener.bind(channel);
  }
};

type Message = {
  name: string;
  type: "insert" | "update" | "remove";
  document: Document<any>;
};
