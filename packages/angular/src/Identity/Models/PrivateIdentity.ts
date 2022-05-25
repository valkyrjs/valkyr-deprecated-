import { Injectable } from "@angular/core";
import { Document, Model } from "@valkyr/db";
import { PrivateIdentitySchema, PublicIdentityKeys } from "@valkyr/identity";
import { Signature, Vault } from "@valkyr/security";

export type PrivateIdentityDocument = Document & { alias: string } & PrivateIdentitySchema;

@Injectable({ providedIn: "root" })
export class PrivateIdentity extends Model<PrivateIdentityDocument> {
  readonly alias!: PrivateIdentityDocument["alias"];
  readonly data!: PrivateIdentityDocument["data"];
  readonly keys!: PrivateIdentityDocument["keys"];

  #signature!: Signature;
  #vault!: Vault;

  // ### Lifecycle

  async onInit(): Promise<this> {
    this.#signature = await Signature.import(this.keys.signature);
    this.#vault = await Vault.import(this.keys.vault);
    return this;
  }

  // ### Key Pair Accessors

  get signature(): Signature {
    return this.#signature;
  }

  get vault(): Vault {
    return this.#vault;
  }

  // ### Public Key Accessors

  get publicKeys(): PublicIdentityKeys {
    return {
      signature: this.publicSignatureKey,
      vault: this.publicVaultKey
    };
  }

  get publicSignatureKey(): string {
    return this.keys.signature.publicKey;
  }

  get publicVaultKey(): string {
    return this.keys.vault.publicKey;
  }

  // ### Vault Utilities

  /**
   * Encrypt given data using the users public key.
   *
   * @param value - Value to encrypt.
   */
  get encrypt() {
    return this.vault.encrypt.bind(this.#vault);
  }

  /**
   * Decrypt provided text using the users private key. This allows users
   * to receive encrypted personal data or data provided by third parties.
   *
   * @param text - Text value to decrypt.
   */
  get decrypt() {
    return this.vault.decrypt.bind(this.#vault);
  }

  // ### Export

  async export(): Promise<PrivateIdentitySchema> {
    return {
      id: this.id,
      data: this.data,
      keys: {
        signature: await this.signature.export(),
        vault: await this.vault.export()
      }
    };
  }
}

export type PrivateIdentityModel = typeof PrivateIdentity;
