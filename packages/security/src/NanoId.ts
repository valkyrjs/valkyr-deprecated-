import { customAlphabet, nanoid } from "nanoid";

const values = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numeric: "1234567890"
};

const numeric = customAlphabet(values.numeric, 6);
const alphaUppercase = customAlphabet(values.uppercase);
const alphaLowercase = customAlphabet(values.lowercase);
const alphaNumeric = customAlphabet(values.numeric + values.uppercase + values.lowercase);
const alphaUppercaseNumeric = customAlphabet(values.numeric + values.uppercase);

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
