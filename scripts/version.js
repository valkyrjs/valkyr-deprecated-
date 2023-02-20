const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkgsDir = path.resolve(root, "packages");
const version = process.argv[process.argv.indexOf("--version") + 1]

const pkgs = fs.readdirSync(pkgsDir);
for (const pkg of pkgs) {
  const pkgDir = path.join(pkgsDir, pkg, "package.json");
  const json = JSON.parse(fs.readFileSync(pkgDir, "utf-8"));

  json.version = version;

  for (const key of json.dependencies) {
    if (json.dependencies[key].includes("workspace:*")) {
      json.dependencies[key] = version;
    }
  }

  for (const key of json.devDependencies) {
    if (json.devDependencies[key].includes("workspace:*")) {
      json.devDependencies[key] = version;
    }
  }

  for (const key of json.peerDependencies) {
    if (json.peerDependencies[key].includes("workspace:*")) {
      json.peerDependencies[key] = version;
    }
  }

  fs.writeFileSync(pkgDir, JSON.stringify(json, null, 2));
}