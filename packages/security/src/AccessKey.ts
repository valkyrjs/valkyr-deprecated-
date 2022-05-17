import { AES, enc, PBKDF2 } from "crypto-js";

export class AccessKey {
  #key: string;

  constructor(key: string) {
    this.#key = key;
  }

  // ### Instantiators

  /**
   * Generates a access key which can be used for further encryption of private
   * data. Provides a deterministic access key based on the given value and salt.
   *
   * If the value and salt is the same, the access key will return a
   * deterministic result. Allowing the user to provide two known values to
   * produce a access key.
   *
   * @returns deterministic access key
   */
  static resolve(passphrase: string | CryptoJS.lib.WordArray, salt: string | CryptoJS.lib.WordArray): AccessKey {
    return new AccessKey(PBKDF2(passphrase, salt).toString());
  }

  // ### Accessors

  get key(): string {
    return this.#key;
  }

  // ### Encrypt & Decrypt

  encrypt(value: object | object[]): string {
    return AES.encrypt(JSON.stringify(value), this.#key).toString();
  }

  decrypt<T = unknown>(value: string): T {
    return JSON.parse(AES.decrypt(value, this.#key).toString(enc.Utf8));
  }
}
