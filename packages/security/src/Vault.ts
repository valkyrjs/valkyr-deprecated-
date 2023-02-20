import * as Jose from "jose";

import { ExportedKeyPair, KeyPair } from "./KeyPair.js";

export class Vault extends KeyPair {
  static readonly ALG = "ECDH-ES+A256KW";
  static readonly ENC = "A256GCM";

  // ### Factories

  static async create(): Promise<Vault> {
    return new Vault(await super.create());
  }

  static async import(keyPair: ExportedKeyPair) {
    return new Vault(await super.import(keyPair));
  }

  // ### Utilities

  async encrypt<T extends Record<string, unknown> | unknown[] | string>(value: T): Promise<string> {
    const header = { alg: Vault.ALG, enc: Vault.ENC };
    const text = new TextEncoder().encode(JSON.stringify(value));
    return new Jose.CompactEncrypt(text).setProtectedHeader(header).encrypt(this.publicKey);
  }

  async decrypt<T>(cypherText: string): Promise<T> {
    const { plaintext } = await Jose.compactDecrypt(cypherText, this.privateKey);
    return JSON.parse(new TextDecoder().decode(plaintext));
  }
}
