import { UntarFileStream } from "./UntarFileStream";

export function untar(arrayBuffer: ArrayBuffer): UntarFile[] {
  const files = [];
  const stream = new UntarFileStream(arrayBuffer);
  while (stream.hasNext() === true) {
    const file = stream.next();
    files.push({
      path: file.name,
      body: new TextDecoder("utf-8").decode(file.buffer)
    });
  }
  return files;
}

export type UntarFile = {
  path: string;
  body: string;
};
