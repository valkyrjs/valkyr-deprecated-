const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname);
const pkgs = fs.readdirSync(path.join(__dirname, "packages"));

async function main() {
  for (const pkg of pkgs) {
    await publish(pkg, path.join(root, "packages", pkg));
  }
}

async function publish(pkg, cwd) {
  const cursor = spawn("npm", ["publish", "--access", "public"], { stdio: "inherit", cwd });
  return new Promise((resolve, reject) => {
    cursor.on("close", resolve);
    cursor.on("error", reject);
  });
}

main().catch(err => {
  throw err;
}).finally(() => {
  process.exit(1);
});