export class InvalidSocketMessageBodyError extends Error {
  public readonly type = "InvalidSocketMessageBodyError";

  constructor(keys: string[]) {
    super(`Socket Message Violation: Missing required '${keys.join(", ")}' key(s) in message body`);
  }
}

export type MessageBody = {
  id: string;
  type: string;
  data: Record<string, unknown>;
};

export type ValidatedMessage = {
  id: string;
  type: string;
  data?: Record<string, unknown>;
};

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

const REQUIRED_KEYS: ["id", "event"] = ["id", "event"];

/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

export class SocketMessage {
  public readonly id: string;
  public readonly type: string;
  public readonly data: Record<string, unknown>;

  constructor(message: string) {
    const body = getValidatedMessageBody(JSON.parse(message));
    this.id = body.id;
    this.type = body.type;
    this.data = body.data ?? {};
  }

  public toResponse(data: Record<string, unknown>): string {
    return JSON.stringify({ id: this.id, data });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getValidatedMessageBody(body: Partial<MessageBody>) {
  const missing: string[] = [];
  for (const key of REQUIRED_KEYS) {
    if (body[key] === undefined) {
      missing.push(key);
    }
  }
  if (missing.length) {
    throw new InvalidSocketMessageBodyError(missing);
  }
  return body as ValidatedMessage;
}
