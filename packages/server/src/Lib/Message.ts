import { getValidatedMessageBody } from "../Utils/Message";

export class Message {
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
