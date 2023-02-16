import { PaxHeader } from "./PaxHeader";
import { UntarStream } from "./UntarStream";

export class UntarFileStream {
  #stream: UntarStream;
  #globalPaxHeader: PaxHeader | null = null;

  constructor(arrayBuffer: ArrayBuffer) {
    this.#stream = new UntarStream(arrayBuffer);
  }

  hasNext() {
    return this.#stream.position() + 4 < this.#stream.size() && this.#stream.peakUint32() !== 0;
  }

  next() {
    return this.#readNextFile();
  }

  #readNextFile() {
    const stream = this.#stream;

    const headerBeginPos = stream.position();
    const dataBeginPos = headerBeginPos + 512;

    // ### Generate File

    let file: any = {};

    file.name = stream.readString(100);
    file.mode = stream.readString(8);
    file.uid = parseInt(stream.readString(8));
    file.gid = parseInt(stream.readString(8));
    file.size = parseInt(stream.readString(12), 8);
    file.mtime = parseInt(stream.readString(12), 8);
    file.checksum = parseInt(stream.readString(8));
    file.type = stream.readString(1);
    file.linkname = stream.readString(100);
    file.ustarFormat = stream.readString(6);

    if (file.ustarFormat.indexOf("ustar") > -1) {
      file.version = stream.readString(2);
      file.uname = stream.readString(32);
      file.gname = stream.readString(32);
      file.devmajor = parseInt(stream.readString(8));
      file.devminor = parseInt(stream.readString(8));
      file.namePrefix = stream.readString(155);

      if (file.namePrefix.length > 0) {
        file.name = file.namePrefix + "/" + file.name;
      }
    }

    stream.position(dataBeginPos);

    // ### Some Crazy Switch

    let isHeaderFile = false;
    let paxHeader = null;

    switch (file.type) {
      case "0": // Normal file is either "0" or "\0".
      case "": // In case of "\0", readString returns an empty string, that is "".
        file.buffer = stream.readBuffer(file.size);
        break;
      case "1": // Link to another file already archived
        // TODO Should we do anything with these?
        break;
      case "2": // Symbolic link
        // TODO Should we do anything with these?
        break;
      case "3": // Character special device (what does this mean??)
        break;
      case "4": // Block special device
        break;
      case "5": // Directory
        break;
      case "6": // FIFO special file
        break;
      case "7": // Reserved
        break;
      case "g": // Global PAX header
        isHeaderFile = true;
        this.#globalPaxHeader = PaxHeader.parse(stream.readBuffer(file.size));
        break;
      case "x": // PAX header
        isHeaderFile = true;
        paxHeader = PaxHeader.parse(stream.readBuffer(file.size));
        break;
      default: // Unknown file type
        break;
    }

    if (file.buffer === undefined) {
      file.buffer = new ArrayBuffer(0);
    }

    let dataEndPos = dataBeginPos + file.size;

    // File data is padded to reach a 512 byte boundary; skip the padded bytes too.
    if (file.size % 512 !== 0) {
      dataEndPos += 512 - (file.size % 512);
    }

    stream.position(dataEndPos);

    if (isHeaderFile) {
      file = this.#readNextFile();
    }

    if (this.#globalPaxHeader !== null) {
      this.#globalPaxHeader.applyHeader(file);
    }

    if (paxHeader !== null) {
      paxHeader.applyHeader(file);
    }

    return file;
  }
}
