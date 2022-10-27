export const BroadcastChannel =
  globalThis.BroadcastChannel ??
  class BroadcastChannelMock {
    onmessage?: any;
    postMessage() {}
  };
