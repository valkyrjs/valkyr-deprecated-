type ColorTextFn = (text: string) => string;

const makeColor = (colorFn: ColorTextFn) => (text: string) => colorFn(text);

export const color = {
  green: makeColor((text: string) => `\x1B[32m${text}\x1B[39m`),
  yellow: makeColor((text: string) => `\x1B[33m${text}\x1B[39m`),
  red: makeColor((text: string) => `\x1B[31m${text}\x1B[39m`),
  magentaBright: makeColor((text: string) => `\x1B[95m${text}\x1B[39m`),
  cyanBright: makeColor((text: string) => `\x1B[96m${text}\x1B[39m`)
};
