export const BroadcastChannel =
  globalThis.BroadcastChannel ??
  class BroadcastChannelMock {
    onmessage?: any;
    postMessage() {}
    close() {}
  };

export type StorageBroadcast<Document> =
  | {
      name: string;
      type: "insertOne" | "updateOne";
      data: Document;
    }
  | {
      name: string;
      type: "insertMany" | "updateMany" | "remove";
      data: Document[];
    }
  | {
      name: string;
      type: "flush";
    };
