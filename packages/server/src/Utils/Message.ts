import { REQUIRED_KEYS } from "../Constants/Message";
import { InvalidMessageBodyError } from "../Errors/Message";
import type { Body, ValidatedMessage } from "../Types/Message";

export function getValidatedMessageBody(body: Partial<Body>) {
  const missing: string[] = [];
  for (const key of REQUIRED_KEYS) {
    if (body[key] === undefined) {
      missing.push(key);
    }
  }
  if (missing.length) {
    throw new InvalidMessageBodyError(missing);
  }
  return body as ValidatedMessage;
}
