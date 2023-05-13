import * as Jose from "jose";

import { createKeyPair, ExportedKeyPair, KeyPair, loadKeyPair } from "./KeyPair.js";

/*
 |--------------------------------------------------------------------------------
 | Security Settings
 |--------------------------------------------------------------------------------
 */

const VAULT_ALGORITHM = "ECDH-ES+A256KW";
const VAULT_ENCRYPTION = "A256GCM";

/*
 |--------------------------------------------------------------------------------
 | Vault Manager
 |--------------------------------------------------------------------------------
 */

export class Vault {
  #keyPair: KeyPair;

  constructor(keyPair: KeyPair) {
    this.#keyPair = keyPair;
  }

  get keys() {
    return this.#keyPair;
  }

  async encrypt<T extends Record<string, unknown> | unknown[] | string>(value: T): Promise<string> {
    const text = new TextEncoder().encode(JSON.stringify(value));
    return new Jose.CompactEncrypt(text)
      .setProtectedHeader({
        alg: VAULT_ALGORITHM,
        enc: VAULT_ENCRYPTION
      })
      .encrypt(this.#keyPair.publicKey);
  }

  async decrypt<T>(cypherText: string): Promise<T> {
    const { plaintext } = await Jose.compactDecrypt(cypherText, this.#keyPair.privateKey);
    return JSON.parse(new TextDecoder().decode(plaintext));
  }
}

/*
 |--------------------------------------------------------------------------------
 | Factories
 |--------------------------------------------------------------------------------
 */

export async function createVault(): Promise<Vault> {
  return new Vault(await createKeyPair(VAULT_ALGORITHM));
}

export async function importVault(keyPair: ExportedKeyPair): Promise<Vault> {
  return new Vault(await loadKeyPair(keyPair, VAULT_ALGORITHM));
}
