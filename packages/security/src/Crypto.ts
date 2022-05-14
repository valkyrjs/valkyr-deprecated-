import { AES, enc, PBKDF2 } from "crypto-js";
import * as Jose from "jose";

export const ALG = "ECDH-ES+A256KW";
export const ENC = "A256GCM";

/**
 * Generates a key pair using ECDH-ES+A256KW algorithm.
 *
 * @returns generated keypair
 */
export async function generateKeyPair(): Promise<Jose.GenerateKeyPairResult> {
  return Jose.generateKeyPair(ALG);
}

export function encryptAccessKey(value: object | object[], accessKey: string) {
  return AES.encrypt(JSON.stringify(value), accessKey).toString();
}

export function decryptAccessKey(value: string, accessKey: string) {
  return JSON.parse(AES.decrypt(value, accessKey).toString(enc.Utf8));
}

export async function exportKeyPair(publicKey: Jose.KeyLike, privateKey: Jose.KeyLike) {
  return {
    publicKey: await Jose.exportSPKI(publicKey),
    privateKey: await Jose.exportPKCS8(privateKey)
  };
}

export async function importKeyPair(publicKey: string, privateKey: string) {
  return {
    publicKey: await Jose.importSPKI(publicKey, ALG),
    privateKey: await Jose.importPKCS8(privateKey, ALG)
  };
}

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
 * @param publicKey  - Public key to encrypt
 * @param privateKey - Private key to encrypt
 * @param accessKey  - Key to use for encryption
 *
 * @returns encrypted keypair
 */
export async function encryptKeyPair(
  publicKey: Jose.KeyLike,
  privateKey: Jose.KeyLike,
  accessKey: string
): Promise<string> {
  return AES.encrypt(
    JSON.stringify({
      publicKey: await Jose.exportSPKI(publicKey),
      privateKey: await Jose.exportPKCS8(privateKey)
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
export async function decryptKeyPair(keyPair: string, accessKey: string): Promise<Jose.GenerateKeyPairResult> {
  const decoded = JSON.parse(AES.decrypt(keyPair, accessKey).toString(enc.Utf8));
  return {
    publicKey: await Jose.importSPKI(decoded.publicKey, ALG),
    privateKey: await Jose.importPKCS8(decoded.privateKey, ALG)
  };
}

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
export function generateAccessKey(
  passphrase: string | CryptoJS.lib.WordArray,
  salt: string | CryptoJS.lib.WordArray
): string {
  return PBKDF2(passphrase, salt).toString();
}

/**
 * Encrypt a object using provided public key.
 *
 * @param obj       - Object to encrypt.
 * @param publicKey - Public key used to encrypt the object.
 *
 * @returns encrypted object
 */
export async function encrypt<T extends Record<string, unknown>>(obj: T, publicKey: Jose.KeyLike): Promise<string> {
  const header = { alg: ALG, enc: ENC };
  const text = new TextEncoder().encode(JSON.stringify(obj));
  return new Jose.CompactEncrypt(text).setProtectedHeader(header).encrypt(publicKey);
}

/**
 * Decrypt a cypher text using the provided private key returning the the
 * decrypted result.
 *
 * @param cypherText - Encrypted object to decrypt.
 * @param privateKey - Private key used to decrypt the cipher text.
 *
 * @returns decrypted object
 */
export async function decrypt(cypherText: string, privateKey: Jose.KeyLike) {
  const { plaintext } = await Jose.compactDecrypt(cypherText, privateKey);
  return JSON.parse(new TextDecoder().decode(plaintext));
}
