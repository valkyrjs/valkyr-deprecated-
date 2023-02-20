import prettier from "prettier";

import { toType } from "../Services/Types.js";

export function generateTypes(template: string, config: TypeEntry[]): string {
  return prettier.format(template.replace("${types}", getTypes(config)), {
    parser: "typescript",
    printWidth: 120,
    trailingComma: "none"
  });
}

function getTypes(config: TypeEntry[]): string {
  const result: string[] = [];
  for (const type of config) {
    result.push(`export type ${type.name} = ${getType(type.kind, type.value)};\n`);
  }
  return result.join("\n");
}

function getType(kind: string, value: any): string {
  switch (kind) {
    case "object": {
      return getObjectType(value);
    }
    case "union": {
      return getUnionType(value);
    }
    default: {
      return "unknown";
    }
  }
}

function getUnionType(value: string[]): string {
  return value.map((v) => toType(v)).join(" | ");
}

function getObjectType(value: any): string {
  const result: string[] = [];
  for (const key in value) {
    result.push(`${key}:${toType(value[key]).replace("Type.", "")};`);
  }
  return `{\n${result.join("\n")}\n}`;
}

export type TypeEntry = {
  name: string;
  kind: string;
  value: any;
};
