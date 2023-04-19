const { spawnSync } = require("node:child_process");
const { cpSync, mkdirSync, readdirSync, rmSync } = require("node:fs");
const { join, resolve } = require("node:path");

const { setPackageVersions } = require("./utils/setPackageVersions");

const ROOT_DIR = resolve(__dirname, "..");
const PUBLISH_DIR = resolve(ROOT_DIR, ".publish");
const CONFIGS_DIR = resolve(ROOT_DIR, "configs");
const PACKAGES_DIR = resolve(ROOT_DIR, "packages");
const VERSION = getVersion();

// ### Build Packages

spawnSync("pnpm", ["build"], { stdio: "inherit", cwd: ROOT_DIR });

// ### Prepare Publish Directory

mkdirSync(PUBLISH_DIR);

cpSync(CONFIGS_DIR, join(PUBLISH_DIR, "configs"), { recursive: true });
cpSync(PACKAGES_DIR, join(PUBLISH_DIR, "packages"), { recursive: true });

// ### Prepare Packages

setPackageVersions(join(PUBLISH_DIR, "configs"), VERSION);
setPackageVersions(join(PUBLISH_DIR, "packages"), VERSION);

// ### Publish Packages

const packages = readdirSync(join(PUBLISH_DIR, "packages"));
const configs = readdirSync(join(PUBLISH_DIR, "configs"));

for (const pkg of packages) {
  spawnSync("npm", ["publish", "--registry", "http://192.168.11.82/4873"], {
    stdio: "inherit",
    cwd: join(PUBLISH_DIR, "packages", pkg)
  });
}

for (const cfg of configs) {
  spawnSync("npm", ["publish", "--registry", "http://192.168.11.82/4873"], {
    stdio: "inherit",
    cwd: join(PUBLISH_DIR, "configs", cfg)
  });
}

// ### Clean Up

spawnSync("pnpm", ["clean"], { stdio: "inherit", cwd: ROOT_DIR });
rmSync(PUBLISH_DIR, { recursive: true, force: true });

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function getVersion() {
  const pos = process.argv.indexOf("--version");
  if (pos === -1) {
    throw new Error("No version specified.");
  }
  const version = process.argv[pos + 1];
  if (version === undefined) {
    throw new Error("No version specified.");
  }
  return version;
}
