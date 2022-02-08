import { InvalidSocketMessageBodyError } from "./Errors";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Body = {
  uuid: string;
  type: string;
  data: Record<string, unknown>;
};

type ValidatedMessage = {
  uuid: string;
  type: string;
  data?: Record<string, unknown>;
};

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

const REQUIRED_KEYS: ["uuid", "type"] = ["uuid", "type"];

/*
 |--------------------------------------------------------------------------------
 | Message
 |--------------------------------------------------------------------------------
 */

export class SocketMessage {
  public readonly uuid: string;
  public readonly type: string;
  public readonly data: Record<string, unknown>;

  constructor(message: string) {
    const body = getValidatedMessageBody(JSON.parse(message));
    this.uuid = body.uuid;
    this.type = body.type;
    this.data = body.data ?? {};
  }

  public toResponse(data: Record<string, unknown>): string {
    return JSON.stringify({ uuid: this.uuid, data });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getValidatedMessageBody(body: Partial<Body>) {
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
