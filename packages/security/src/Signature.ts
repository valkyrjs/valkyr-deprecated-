import * as Jose from "jose";

import { ExportedKeyPair, KeyPair } from "./KeyPair";

export class Signature extends KeyPair {
  static readonly ALG = "ES256";

  static async create(): Promise<Signature> {
    return new Signature(await super.create());
  }

  static async import(keyPair: ExportedKeyPair) {
    return new Signature(await super.import(keyPair));
  }

  static async verify(jwt: string, publicKey: string): Promise<Jose.JWTVerifyResult> {
    return Jose.jwtVerify(jwt, await Signature.importPublicKey(publicKey));
  }

  async sign(payload: Jose.JWTPayload, options: TokenSignatureOptions = {}): Promise<string> {
    const cursor = new Jose.SignJWT(payload).setProtectedHeader({ alg: Signature.ALG });
    assignSignatureOptions(cursor, options);
    return cursor.sign(this.privateKey);
  }
}

// ### Helpers

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
