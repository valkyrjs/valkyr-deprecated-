import { getAlphaUppercaseNumeric } from "./NanoId";

export function generateSecretKey() {
  return `${gen(3)}-${gen(5)}-${gen(6)}-${gen(5)}-${gen(5)}-${gen(5)}-${gen(5)}`;
}

function gen(size: number) {
  return getAlphaUppercaseNumeric(size);
}
