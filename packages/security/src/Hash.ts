import * as CryptoJS from "crypto-js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#¤%&/()=?@£$€{[]}+-*',
  64
);

/**
 * Generate a random hash.
 *
 * @returns random SHA256 hash
 */
export function generateRandomHash(): string {
  return generateHash(nanoid());
}

/**
 * Generate a hash from the given value using the SHA256 hashing algorithm.
 *
 * @param value - Value to generate a hash string from.
 *
 * @returns SHA256 hash
 */
export function generateHash(value: string): string {
  return CryptoJS.SHA256(value).toString();
}
