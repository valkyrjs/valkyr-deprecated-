const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname);
const pkgs = ["access", "auth", "db", "inverse", "ledger", "router", "server", "socket", "utils"];

async function main() {
  for (const pkg of pkgs) {
    await publish(pkg, path.join(root, "packages", pkg));
  }
}

async function publish(pkg, cwd) {
  console.log("Publishing", pkg);
  const cursor = spawn("npm", ["publish"], { stdio: "inherit", cwd });
  return new Promise((resolve, reject) => {
    cursor.on("close", resolve);
    cursor.on("error", reject);
  });
}

main().finally(() => {
  process.exit(0);
});