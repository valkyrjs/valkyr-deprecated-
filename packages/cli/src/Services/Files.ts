import fs from "fs-extra";

export function readFile(path: string): string {
  return fs.readFileSync(path, "utf-8");
}

export function writeFile(path: string, content: string): void {
  fs.writeFileSync(path, content, "utf-8");
}

export function ensureFolder(path: string): void {
  fs.ensureDirSync(path);
}

export function copyFolder(src: string, dest: string): void {
  fs.copySync(src, dest, { overwrite: true });
}
