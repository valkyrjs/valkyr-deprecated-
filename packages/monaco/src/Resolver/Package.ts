import { db, File, Package } from "../Database.js";
import { getNpmPackageFiles } from "./Npm.js";
import { isNativePackage } from "./Package.Native.js";
import { PackageJSON, parsePackageJson } from "./Unpkg.Json.js";

// const FILE_IMPORT_EXPORT_SEARCH = /^(import|export)\s+.*?from\s+["'](.+?)["'];$/gm;
// const IMPORT_EXPORT_REGEX = /^(import|export)\s+.*?from\s+["'](.+?)["'];$/;

const PACKAGE_DEPTH = 3;

const resolving = new Set<string>();

/*
 |--------------------------------------------------------------------------------
 | Package
 |--------------------------------------------------------------------------------
 */

export async function resolvePackage(name: string, version?: string, currentDepth = 0): Promise<void> {
  if ((await isResolvable(name)) === false) {
    return; // package is already resolved
  }
  resolving.add(name);

  let pkg: PackageJSON | undefined;

  try {
    const files = await getNpmPackageFiles(name, version);
    for (const { path, body } of files) {
      if (path === "package.json") {
        pkg = parsePackageJson(body);
        await db.collection("packages").insertOne(pkg);
      } else {
        await db.collection("files").insertOne({ name, path, body });
      }
    }
  } catch (err) {
    console.log(err);
  }

  if (currentDepth < PACKAGE_DEPTH) {
    if (pkg !== undefined && pkg.dependencies !== undefined) {
      for (const dep in pkg.dependencies) {
        await resolvePackage(dep, undefined, currentDepth + 1);
      }
    }
  }
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

// async function resolvePackageFile(file: string): Promise<void> {
//   const result = file.match(FILE_IMPORT_EXPORT_SEARCH);
//   if (result === null) {
//     return;
//   }
//   for (const line of result) {
//     const matched = line.match(IMPORT_EXPORT_REGEX);
//     const name = matched?.[2];
//     if (name !== undefined && name.startsWith(".") === false) {
//       await resolvePackage(name);
//     }
//   }
// }

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

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
