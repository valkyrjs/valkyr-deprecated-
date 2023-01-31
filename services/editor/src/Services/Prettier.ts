import { Options } from "prettier";
import tsParser from "prettier/parser-typescript";
import prettier from "prettier/standalone";

export function format(source: string, options?: Options | undefined) {
  return prettier.format(source, {
    ...(options ?? {}),
    parser: "typescript",
    plugins: [tsParser, ...(options?.plugins ?? [])]
  });
}
