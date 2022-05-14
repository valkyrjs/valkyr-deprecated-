import { customAlphabet, nanoid } from "nanoid";

const numeric = customAlphabet("1234567890", 6);
const alphaUppercase = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const alphaLowercase = customAlphabet("abcdefghijklmnopqrstuvwxyz");
const alphaNumeric = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
const alphaUppercaseNumeric = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ");

export function getNumeric(size = 6): string {
  return numeric(size);
}

export function getAlphaUppercase(size?: number): string {
  return alphaUppercase(size);
}

export function getAlphaLowercase(size?: number): string {
  return alphaLowercase(size);
}

export function getAlphaUppercaseNumeric(size?: number): string {
  return alphaUppercaseNumeric(size);
}

export function getId(size?: number): string {
  return alphaNumeric(size);
}

export { nanoid };
