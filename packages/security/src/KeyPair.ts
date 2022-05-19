import { AES, enc } from "crypto-js";
import * as Jose from "jose";

export const ALG = "ECDH-ES+A256KW";
export const ENC = "A256GCM";

export type ExportedKeyPair = {
  publicKey: string;
  privateKey: string;
};

export class KeyPair {
  #publicKey: Jose.KeyLike;
  #privateKey: Jose.KeyLike;

  constructor({ publicKey, privateKey }: Jose.GenerateKeyPairResult) {
    this.#publicKey = publicKey;
    this.#privateKey = privateKey;
  }

  // ### Accessors

  get publicKey() {
    return this.#publicKey;
  }

  get privateKey() {
    return this.#privateKey;
  }

  // ### Instantiators

  static async create(): Promise<KeyPair> {
    return new KeyPair(await Jose.generateKeyPair(ALG, { extractable: true }));
  }

  static async import({ publicKey, privateKey }: ExportedKeyPair) {
    return new KeyPair({
      publicKey: await importPublicKey(publicKey),
      privateKey: await importPrivateKey(privateKey)
    });
  }

  // ### Exporter

  async export() {
    return {
      publicKey: await this.exportPublicKey(),
      privateKey: await this.exportPrivateKey()
    };
  }

  async exportPublicKey() {
    return Jose.exportSPKI(this.#publicKey);
  }

  async exportPrivateKey() {
    return Jose.exportPKCS8(this.#privateKey);
  }

  // ### KeyPair Access Key

  /**
   * Encrypt a public and private key using the provided access key.
   *
   * This is a proposed method for being able to store a users security
   * information in a public ledger. The keypair can only be unlocked
   * by a deterministic encryption key based on a users known values such
   * as a password, fob, or some other value.
   *
   * The security risk at this point would be the strength of the values
   * provided by the user. So enforcing users to provide strong non
   * guessable values is advised.
   *
   * Through this method it is possible for users to change their access
   * key as long as they have their old access key available. Which
   * enabled support for periodic rotation of access key value.
   *
   * @param accessKey  - Key to use for encryption
   *
   * @returns encrypted keypair
   */
  async encryptKeyPair(accessKey: string): Promise<string> {
    return AES.encrypt(
      JSON.stringify({
        publicKey: await Jose.exportSPKI(this.#publicKey),
        privateKey: await Jose.exportPKCS8(this.#privateKey)
      }),
      accessKey
    ).toString();
  }

  /**
   * Decrypt a users key pair using a deterministic access key based on a
   * users known values such  as a password, fob, or some other value.
   *
   * @param keyPair   - KeyPair to decrypt.
   * @param accessKey - Key used to decrypt the keys.
   *
   * @returns decrypted keypair
   */
  async decryptKeyPair(keyPair: string, accessKey: string): Promise<Jose.GenerateKeyPairResult> {
    const decoded = JSON.parse(AES.decrypt(keyPair, accessKey).toString(enc.Utf8));
    return new KeyPair({
      publicKey: await Jose.importSPKI(decoded.publicKey, ALG),
      privateKey: await Jose.importPKCS8(decoded.privateKey, ALG)
    });
  }

  // ### Encrypt & Decrypt

  async encrypt<T extends Record<string, unknown>>(value: T): Promise<string> {
    const header = { alg: ALG, enc: ENC };
    const text = new TextEncoder().encode(JSON.stringify(value));
    return new Jose.CompactEncrypt(text).setProtectedHeader(header).encrypt(this.#publicKey);
  }

  async decrypt(cypherText: string) {
    const { plaintext } = await Jose.compactDecrypt(cypherText, this.#privateKey);
    return JSON.parse(new TextDecoder().decode(plaintext));
  }
}

export async function importPublicKey(publicKey: string): Promise<Jose.KeyLike> {
  return Jose.importSPKI(publicKey, ALG, { extractable: true });
}

export async function importPrivateKey(privateKey: string): Promise<Jose.KeyLike> {
  return Jose.importPKCS8(privateKey, ALG, { extractable: true });
}
