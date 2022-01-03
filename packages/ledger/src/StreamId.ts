import { customAlphabet, urlAlphabet } from "@valkyr/utils";

const nanoid = customAlphabet(urlAlphabet, 14);

export function generateStreamId(size?: number): string {
  return nanoid(size);
}
