export async function resolveUnpkgMeta(name: string, version = "latest"): Promise<any> {
  console.log("Resolve meta", `https://unpkg.com/${getEncodedName(name)}@${version}/?meta`);
  const meta = await resolveFile(`https://unpkg.com/${getEncodedName(name)}@${version}/?meta`);
  if (meta === undefined) {
    throw new Error(`Unpkg Meta Not Found: ${name}@${version}`);
  }
  return JSON.parse(meta);
}

export async function resolveUnpkgFile(name: string, path: string, version = "latest"): Promise<string> {
  const file = await resolveFile(`https://unpkg.com/${getEncodedName(name)}@${version}/${path}`);
  if (file === undefined) {
    throw new Error(`Unpkg File Not Found: ${name}@${version}/${path}`);
  }
  return file;
}

async function resolveFile(url: string): Promise<string | undefined> {
  const res = await fetch(url, { method: "GET" });
  if (res.ok === true) {
    return res.text();
  }
  if (res.status !== 404) {
    throw new Error(`Unpkg Error: ${res.status} ${res.statusText}`);
  }
}

function getEncodedName(name: string): string {
  return name.replace("/", "%2F").replace("@", "%40");
}
