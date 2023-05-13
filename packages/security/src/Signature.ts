import * as Jose from "jose";

import { createKeyPair, ExportedKeyPair, KeyPair, loadKeyPair } from "./KeyPair.js";

/*
 |--------------------------------------------------------------------------------
 | Security Settings
 |--------------------------------------------------------------------------------
 */

const SIGNATURE_ALGORITHM = "ES256";

/*
 |--------------------------------------------------------------------------------
 | Signature Manager
 |--------------------------------------------------------------------------------
 */

export class Signature {
  #keyPair: KeyPair;

  constructor(keyPair: KeyPair) {
    this.#keyPair = keyPair;
  }

  get keys() {
    return this.#keyPair;
  }

  async sign(payload: Jose.JWTPayload, options: TokenSignatureOptions = {}): Promise<string> {
    const cursor = new Jose.SignJWT(payload).setProtectedHeader({ alg: SIGNATURE_ALGORITHM });
    assignSignatureOptions(cursor, options);
    return cursor.sign(this.#keyPair.privateKey);
  }

  async verify(jwt: string): Promise<Jose.JWTVerifyResult> {
    return Jose.jwtVerify(jwt, this.#keyPair.publicKey).catch((error) => {
      if (error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
        throw new Signature.JWTInvalidException();
      }
      if (error.code === "ERR_JWT_EXPIRED") {
        throw new Signature.JWTExpiredException();
      }
      throw error;
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Exception Handlers
   |--------------------------------------------------------------------------------
   */

  static JWTInvalidException = class extends Error {
    constructor() {
      super("Signature Exception: Provided JWT is invalid.");
    }
  };

  static JWTExpiredException = class extends Error {
    constructor() {
      super("Signature Exception: Provided JWT has expired.");
    }
  };
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function assignSignatureOptions(sign: Jose.SignJWT, options: TokenSignatureOptions): void {
  if (options.audience) {
    sign.setAudience(options.audience);
  }
  if (options.expiresAt) {
    sign.setExpirationTime(options.expiresAt);
  }
  if (options.issuedAt) {
    sign.setIssuedAt(options.issuedAt);
  }
  if (options.issuer) {
    sign.setIssuer(options.issuer);
  }
  if (options.jti) {
    sign.setJti(options.jti);
  }
  if (options.notBefore) {
    sign.setNotBefore(options.notBefore);
  }
  if (options.subject) {
    sign.setSubject(options.subject);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Factories
 |--------------------------------------------------------------------------------
 */

export async function createSignature(): Promise<Signature> {
  return new Signature(await createKeyPair(SIGNATURE_ALGORITHM));
}

export async function loadSignature(keyPair: ExportedKeyPair): Promise<Signature> {
  return new Signature(await loadKeyPair(keyPair, SIGNATURE_ALGORITHM));
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type JWTPayload = Jose.JWTPayload;

type TokenSignatureOptions = {
  audience?: string | string[];
  subject?: string;
  jti?: string;
  notBefore?: string | number;
  issuer?: string;
  issuedAt?: number;
  expiresAt?: string | number;
};
