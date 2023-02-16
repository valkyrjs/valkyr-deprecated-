import { db, File, Package } from "../Database";
import { isNativePackage } from "./Package.Native";
import { resolveUnpkgFile, resolveUnpkgMeta } from "./Unpkg";
import { parsePackageJson } from "./Unpkg.Json";

const FILE_IMPORT_EXPORT_SEARCH = /^(import|export)\s+.*?from\s+["'](.+?)["'];$/gm;
const IMPORT_EXPORT_REGEX = /^(import|export)\s+.*?from\s+["'](.+?)["'];$/;

const resolving = new Set<string>();

/*
 |--------------------------------------------------------------------------------
 | Package
 |--------------------------------------------------------------------------------
 */

export async function resolvePackage(name: string, version = "latest"): Promise<void> {
  if ((await isResolvable(name)) === false) {
    return; // package is already resolved
  }
  resolving.add(name);

  const meta = await resolveUnpkgMeta(name, version);

  for (const filePath of getTypeFiles(meta.files, Array.from)) {
    const path = removeRelativePath(filePath);
    const body = await resolveUnpkgFile(name, path, version);
    await db.collection("files").insertOne({ name, path, body });
    await resolvePackageFile(body);
  }

  await db.collection("packages").insertOne(parsePackageJson(await resolveUnpkgFile(name, "package.json", version)));
}

export async function getPackages(): Promise<Package[]> {
  return db.collection("packages").find();
}

export async function getPackageByName(name: string): Promise<Package | undefined> {
  return db.collection("packages").findOne({ name });
}

export async function getPackageFiles(name: string): Promise<File[]> {
  return db.collection("files").find({ name });
}

export async function getPackageFile(path: string): Promise<File | undefined> {
  return db.collection("files").findOne({ path });
}

/*
 |--------------------------------------------------------------------------------
 | Resolve Imports & Exports
 |--------------------------------------------------------------------------------
 */

async function resolvePackageFile(file: string): Promise<void> {
  const result = file.match(FILE_IMPORT_EXPORT_SEARCH);
  if (result === null) {
    return;
  }
  for (const line of result) {
    const matched = line.match(IMPORT_EXPORT_REGEX);
    const name = matched?.[2];
    if (name !== undefined && name.startsWith(".") === false) {
      await resolvePackage(name);
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function removeRelativePath(path: string) {
  return path.replace(/^\.\//, "");
}

function getTypeFiles(files: MetaEntry[]): Set<string>;
function getTypeFiles(files: MetaEntry[], parseResult: Function): string[];
function getTypeFiles(files: MetaEntry[], parseResult?: Function): string[] | Set<string> {
  let resolved = new Set<string>();
  for (const file of files) {
    if (file.type === "directory") {
      resolved = new Set([...resolved, ...getTypeFiles(file.files)]);
    } else if (file.path.endsWith(".d.ts")) {
      resolved.add(file.path);
    }
  }
  return parseResult !== undefined ? parseResult(resolved) : resolved;
}

async function isResolvable(name: string): Promise<boolean> {
  if (isNativePackage(name) === true) {
    return false;
  }
  if (resolving.has(name) === true) {
    return false;
  }
  if ((await db.collection("packages").findOne({ name })) !== undefined) {
    return false;
  }
  return true;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type MetaEntry = {
  path: string;
  type: "directory" | "file";
  files: MetaEntry[];
};
