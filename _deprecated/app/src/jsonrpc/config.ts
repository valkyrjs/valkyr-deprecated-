export const config = {
  get http(): string {
    const uri = process.env.JSON_RPC_HTTP;
    if (uri === undefined) {
      throw new Error("JSON RPC APP: HTTP endpoint has not been configured");
    }
    return uri;
  },
  get ws(): string {
    const uri = process.env.JSON_RPC_WS;
    if (uri === undefined) {
      throw new Error("JSON RPC APP: WebSocket endpoint has not been configured");
    }
    return uri;
  }
} as const;
