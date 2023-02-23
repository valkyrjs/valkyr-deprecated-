const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT_DIR = path.resolve(__dirname, "..");

const pkgs = fs.readdirSync(path.join(ROOT_DIR, "packages"));
const cfgs = fs.readdirSync(path.join(ROOT_DIR, "configs"));

async function main() {
  for (const pkg of pkgs) {
    await publish(pkg, path.join(ROOT_DIR, "packages", pkg));
  }
  for (const cfg of cfgs) {
    await publish(cfg, path.join(ROOT_DIR, "configs", cfg));
  }
}

async function publish(pkg, cwd) {
  const cursor = spawn("npm", ["publish", "--access", "public"], { stdio: "inherit", cwd });
  return new Promise((resolve, reject) => {
    cursor.on("close", resolve);
    cursor.on("error", reject);
  });
}

main()
  .catch((err) => {
    throw err;
  })
  .finally(() => {
    process.exit(0);
  });
