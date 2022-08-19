import { base64UrlDecode } from "./Base64UrlDecode";

const StorageKey = "token";

/*
 |--------------------------------------------------------------------------------
 | JsonWebToken Export
 |--------------------------------------------------------------------------------
 */

export const jwt = {
  set token(value: string | null) {
    if (value === null) {
      localStorage.removeItem(StorageKey);
    } else {
      localStorage.setItem(StorageKey, value);
    }
  },

  get token(): string | null {
    return localStorage.getItem(StorageKey);
  },

  /**
   * Validate token by checking for existence and ensuring that the token has not
   * gone past its expiration date.
   */
  validate,

  /**
   * Decode the token from JWT string to expected JSON output representing the
   * authenticated session.
   */
  decode
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function validate(this: typeof jwt): Promise<void> {
  if (this.token === null) {
    throw new TokenNotFoundError();
  }
  const { exp } = decode<Token>(this.token);
  checkTokenExpiry(exp);
}

function decode<D = unknown>(token: string, options: Options = {}): D {
  validateTokenType(token);
  try {
    return JSON.parse(base64UrlDecode(token.split(".")[getPos(options.header)]));
  } catch (e) {
    throw new InvalidTokenError(e.message);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

function checkTokenExpiry(exp: number): void {
  const cur = Math.floor(Date.now() / 1000);
  if (exp < cur) {
    throw new InvalidTokenError("token has expired");
  }
}

function validateTokenType(token: unknown): void {
  const tokenType = typeof token;
  if (tokenType !== "string") {
    throw new InvalidTokenError(`invalid token type '${tokenType}' provided, expected 'string' type`);
  }
}

function getPos(header?: boolean): number {
  return header === true ? 0 : 1;
}

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

export class TokenNotFoundError extends Error {
  readonly type = "TokenNotFoundError" as const;

  constructor() {
    super("Token Violation: Token has not been set");
  }
}

export class InvalidTokenError extends Error {
  readonly type = "InvalidTokenError" as const;

  constructor(message: string) {
    super(`Token Violation: Invalid token specified <${message}>`);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type TokenResponse = {
  access_token: string;
};

export type Token = {
  iat: number;
  exp: number;
};

type Options = {
  header?: boolean;
};
