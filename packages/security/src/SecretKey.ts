const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateSecretKey() {
  return `${gen(3)}-${gen(5)}-${gen(6)}-${gen(5)}-${gen(5)}-${gen(5)}-${gen(5)}`;
}

function gen(size: number) {
  return [...Array(size)].map(() => CHARS.charAt(Math.floor(Math.random() * CHARS.length))).join("");
}
