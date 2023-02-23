import pako from "pako";

import { untar, UntarFile } from "../Untar/mod.js";

/*
 |--------------------------------------------------------------------------------
 | Package
 |--------------------------------------------------------------------------------
 */

export async function getNpmPackageFiles(packageName: string, version?: string) {
  const name = getPackageName(packageName);
  const tgz = await getPackageTgz(name, version);
  return getTypedFiles(`https://registry.npmjs.org/${name}/-/${tgz}`);
}

function getPackageName(packageName: string) {
  if (packageName.startsWith("@")) {
    return packageName;
  }
  if (packageName.includes("/")) {
    return packageName.split("/")[0];
  }
  return packageName;
}

export async function getNpmPackageVersions(packageName: string): Promise<{ latest: string; versions: string[] }> {
  const metadata = await getNpmResource(packageName).then((res) => res.json());
  return {
    latest: metadata["dist-tags"].latest,
    versions: Object.keys(metadata.versions)
  };
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function getTypedFiles(url: string) {
  const files = await fetchTarballFiles(url);
  return files
    .filter((file: UntarFile) => {
      return file.path.endsWith(".d.ts") || file.path === "package/package.json";
    })
    .map((file: UntarFile) => ({
      path: file.path.replace("package/", ""),
      body: file.body
    }));
}

function fetchTarballFiles(url: string): Promise<UntarFile[]> {
  console.log(url);
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then(pako.inflate)
    .then((arr) => arr.buffer)
    .then(untar);
}

async function getNpmResource(resource: string): Promise<Response> {
  const res = await fetch(`https://registry.npmjs.org/${resource}`, { method: "GET" });
  if (res.ok === true) {
    return res;
  }
  throw new Error(`NPM Error: ${res.status} ${res.statusText}`);
}

async function getPackageTgz(packageName: string, version?: string) {
  let name = packageName;
  if (packageName.startsWith("@")) {
    [, name] = packageName.split("/");
  }
  const { latest, versions } = await getNpmPackageVersions(packageName);
  if (version === undefined) {
    version = latest;
  }
  if (versions.includes(version) === false) {
    throw new Error(`Version not found: ${packageName}@${version}`);
  }
  return `${name}-${version}.tgz`;
}
