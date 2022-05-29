import { AES, enc } from "crypto-js";
import * as Jose from "jose";

const PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----\n";
const PUBLIC_KEY_FOOTER = "\n-----END PUBLIC KEY-----";
const PRIVATE_KEY_HEADER = "-----BEGIN PRIVATE KEY-----\n";
const PRIVATE_KEY_FOOTER = "\n-----END PRIVATE KEY-----";

export type ExportedKeyPair = {
  publicKey: string;
  privateKey: string;
};

export class KeyPair {
  static readonly ALG: string;

  #publicKey: Jose.KeyLike;
  #privateKey: Jose.KeyLike;

  constructor({ publicKey, privateKey }: Jose.GenerateKeyPairResult) {
    this.#publicKey = publicKey;
    this.#privateKey = privateKey;
  }

  // ### Factories

  static async create(): Promise<Jose.GenerateKeyPairResult> {
    return Jose.generateKeyPair(this.ALG, { extractable: true });
  }

  static async import({ publicKey, privateKey }: ExportedKeyPair): Promise<Jose.GenerateKeyPairResult> {
    return {
      publicKey: await this.importPublicKey(publicKey),
      privateKey: await this.importPrivateKey(privateKey)
    };
  }

  static async importPublicKey(key: string): Promise<Jose.KeyLike> {
    return Jose.importSPKI(`${PUBLIC_KEY_HEADER}${key}${PUBLIC_KEY_FOOTER}`, this.ALG, { extractable: true });
  }

  static async importPrivateKey(key: string): Promise<Jose.KeyLike> {
    return Jose.importPKCS8(`${PRIVATE_KEY_HEADER}${key}${PRIVATE_KEY_FOOTER}`, this.ALG, { extractable: true });
  }

  // ### Accessors

  get ALG() {
    return (this as any).constructor.ALG;
  }

  get publicKey() {
    return this.#publicKey;
  }

  get privateKey() {
    return this.#privateKey;
  }

  // ### Exporters

  async export() {
    return {
      publicKey: await this.exportPublicKey(),
      privateKey: await this.exportPrivateKey()
    };
  }

  async exportPublicKey() {
    const key = await Jose.exportSPKI(this.#publicKey);
    return key.replace(PUBLIC_KEY_HEADER, "").replace(PUBLIC_KEY_FOOTER, "");
  }

  async exportPrivateKey() {
    const key = await Jose.exportPKCS8(this.#privateKey);
    return key.replace(PRIVATE_KEY_HEADER, "").replace(PRIVATE_KEY_FOOTER, "");
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
      publicKey: await Jose.importSPKI(decoded.publicKey, this.ALG),
      privateKey: await Jose.importPKCS8(decoded.privateKey, this.ALG)
    });
  }
}
