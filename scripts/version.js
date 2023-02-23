const { readdirSync, readFileSync, writeFileSync } = require("node:fs");
const { resolve, join } = require("node:path");

const ROOT_DIR = resolve(__dirname, "..");
const PKGS_DIR = resolve(ROOT_DIR, "packages");
const CONF_DIR = resolve(ROOT_DIR, "configs");

const version = process.argv[process.argv.indexOf("--version") + 1];

setPackageVersions(PKGS_DIR);
setPackageVersions(CONF_DIR);

function setPackageVersions(rootDir) {
  const packageDirs = readdirSync(rootDir);
  for (const packageDir of packageDirs) {
    const packagePath = join(rootDir, packageDir, "package.json");
    const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));

    packageJson.version = version;

    if (packageJson.dependencies !== undefined) {
      for (const key in packageJson.dependencies) {
        if (packageJson.dependencies[key].includes("workspace:*")) {
          packageJson.dependencies[key] = version;
        }
      }
    }

    if (packageJson.devDependencies !== undefined) {
      for (const key in packageJson.devDependencies) {
        if (packageJson.devDependencies[key].includes("workspace:*")) {
          packageJson.devDependencies[key] = version;
        }
      }
    }

    if (packageJson.peerDependencies !== undefined) {
      for (const key in packageJson.peerDependencies) {
        if (packageJson.peerDependencies[key].includes("workspace:*")) {
          packageJson.peerDependencies[key] = version;
        }
      }
    }

    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  }
}
