import { db } from "../Data/Type.Database";

let cachedTypes = new Set<string>();

db.collection("types").subscribe({}, {}, (types) => {
  cachedTypes = new Set<string>();
  for (const type of types) {
    cachedTypes = new Set([...cachedTypes, ...new Set<string>(getTypeNames(type.value))]);
  }
});

export function getTypes(): string[] {
  return Array.from(cachedTypes);
}

function getTypeNames(value: string): string[] {
  return Array.from(value.matchAll(/type (.*) =/gi)).map((match) => `${match[1]}`);
}
