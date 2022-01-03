import { base64UrlDecode } from "./Base64UrlDecode";

type Options = {
  header?: boolean;
};

class InvalidTokenError extends Error {
  public readonly type = "InvalidTokenError";

  constructor(message: string) {
    super(message);
  }
}

export function decode<D = unknown>(token: string, options: Options = {}): D {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified");
  }
  const pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64UrlDecode(token.split(".")[pos]));
  } catch (e: any) {
    throw new InvalidTokenError("Invalid token specified: " + e.message);
  }
}
