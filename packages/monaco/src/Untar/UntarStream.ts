export class UntarStream {
  #bufferView: DataView;
  #position = 0;

  constructor(arrayBuffer: ArrayBuffer) {
    this.#bufferView = new DataView(arrayBuffer);
  }

  readString(charCount: number) {
    const charSize = 1;
    const byteCount = charCount * charSize;

    const charCodes = [];

    for (let i = 0; i < charCount; ++i) {
      const charCode = this.#bufferView.getUint8(this.position() + i * charSize);
      if (charCode !== 0) {
        charCodes.push(charCode);
      } else {
        break;
      }
    }

    this.seek(byteCount);

    return String.fromCharCode.apply(null, charCodes);
  }

  readBuffer(byteCount: number) {
    let buffer;

    if (typeof ArrayBuffer.prototype.slice === "function") {
      buffer = this.#bufferView.buffer.slice(this.position(), this.position() + byteCount);
    } else {
      buffer = new ArrayBuffer(byteCount);
      const target = new Uint8Array(buffer);
      const src = new Uint8Array(this.#bufferView.buffer, this.position(), byteCount);
      target.set(src);
    }

    this.seek(byteCount);

    return buffer;
  }

  position(newPosition?: number): number {
    if (newPosition !== undefined) {
      this.#position = newPosition;
    }
    return this.#position;
  }

  seek(byteCount: number) {
    this.#position += byteCount;
  }

  peakUint32(): number {
    return this.#bufferView.getUint32(this.position(), true);
  }

  size(): number {
    return this.#bufferView.byteLength;
  }
}
