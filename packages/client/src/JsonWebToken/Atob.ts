/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

class InvalidCharacterError extends Error {
  public readonly type = "InvalidCharacterError";

  constructor(message: string) {
    super(message);
  }
}

function polyfill(input: string) {
  const str = String(input).replace(/=+$/, "");
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  let output = "";
  for (
    // initialize result and counters
    let bc = 0, bs = 0, buffer, idx = 0;
    // get next character
    (buffer = str.charAt(idx++));
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer &&
    ((bs = bc % 4 ? bs * 64 + buffer : buffer),
    // and if not first of each 4 characters,
    // convert the first 8 bits to one ascii character
    bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}

export const atob = (typeof window !== "undefined" && window.atob && window.atob.bind(window)) || polyfill;
