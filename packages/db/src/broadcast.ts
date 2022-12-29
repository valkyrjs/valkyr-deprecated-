export const BroadcastChannel =
  globalThis.BroadcastChannel ??
  class BroadcastChannelMock {
    onmessage?: any;
    postMessage() {}
    close() {}
  };

export type StorageBroadcast<Document> =
  | {
      type: "insertOne" | "updateOne";
      data: Document;
    }
  | {
      type: "insertMany" | "updateMany" | "remove";
      data: Document[];
    }
  | {
      type: "flush";
    };
