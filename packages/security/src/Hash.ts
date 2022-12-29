import * as CryptoJS from "crypto-js";

/**
 * Generate a random hash.
 *
 * @returns random SHA256 hash
 */
export function generateRandomHash(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
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
