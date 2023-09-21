import { Document, WithId } from "./Types.js";

export const BroadcastChannel =
  globalThis.BroadcastChannel ??
  class BroadcastChannelMock {
    onmessage?: any;
    postMessage() {}
    close() {}
  };

export type StorageBroadcast<TSchema extends Document = Document> =
  | {
      name: string;
      type: "insertOne" | "updateOne";
      data: WithId<TSchema>;
    }
  | {
      name: string;
      type: "insertMany" | "updateMany" | "remove";
      data: WithId<TSchema>[];
    }
  | {
      name: string;
      type: "flush";
    };
