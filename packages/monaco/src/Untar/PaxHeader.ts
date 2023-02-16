export class PaxHeader {
  #fields: any;

  constructor(fields: any) {
    this.#fields = fields;
  }

  static parse(buffer: ArrayBuffer) {
    const fields = [];

    let bytes = new Uint8Array(buffer);
    while (bytes.length > 0) {
      // Decode bytes up to the first space character; that is the total field length
      const fieldLength = parseInt(decodeUTF8(bytes.subarray(0, bytes.indexOf(0x20))));
      const fieldText = decodeUTF8(bytes.subarray(0, fieldLength));
      const fieldMatch = fieldText.match(/^\d+ ([^=]+)=(.*)\n$/);

      if (fieldMatch === null) {
        throw new Error("Invalid PAX header data format.");
      }

      const fieldName = fieldMatch[1];
      let fieldValue: string | number | null = fieldMatch[2];

      if (fieldValue.length === 0) {
        fieldValue = null;
      } else if (fieldValue.match(/^\d+$/) !== null) {
        // If it's a integer field, parse it as int
        fieldValue = parseInt(fieldValue);
      }
      // Don't parse float values since precision is lost

      const field = {
        name: fieldName,
        value: fieldValue
      };

      fields.push(field);

      bytes = bytes.subarray(fieldLength); // Cut off the parsed field data
    }

    return new PaxHeader(fields);
  }

  applyHeader(file: any) {
    this.#fields.forEach(function (field: any) {
      let fieldName = field.name;
      const fieldValue = field.value;

      if (fieldName === "path") {
        // This overrides the name and prefix fields in the following header block.
        fieldName = "name";

        if (file.prefix !== undefined) {
          delete file.prefix;
        }
      } else if (fieldName === "linkpath") {
        // This overrides the linkname field in the following header block.
        fieldName = "linkname";
      }

      if (fieldValue === null) {
        delete file[fieldName];
      } else {
        file[fieldName] = fieldValue;
      }
    });
  }
}

function decodeUTF8(bytes: Uint8Array) {
  let s = "";
  let i = 0;
  while (i < bytes.length) {
    let c = bytes[i++];
    if (c > 127) {
      if (c > 191 && c < 224) {
        if (i >= bytes.length) throw "UTF-8 decode: incomplete 2-byte sequence";
        c = ((c & 31) << 6) | (bytes[i] & 63);
      } else if (c > 223 && c < 240) {
        if (i + 1 >= bytes.length) throw "UTF-8 decode: incomplete 3-byte sequence";
        c = ((c & 15) << 12) | ((bytes[i] & 63) << 6) | (bytes[++i] & 63);
      } else if (c > 239 && c < 248) {
        if (i + 2 >= bytes.length) throw "UTF-8 decode: incomplete 4-byte sequence";
        c = ((c & 7) << 18) | ((bytes[i] & 63) << 12) | ((bytes[++i] & 63) << 6) | (bytes[++i] & 63);
      } else throw "UTF-8 decode: unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1);
      ++i;
    }

    if (c <= 0xffff) s += String.fromCharCode(c);
    else if (c <= 0x10ffff) {
      c -= 0x10000;
      s += String.fromCharCode((c >> 10) | 0xd800);
      s += String.fromCharCode((c & 0x3ff) | 0xdc00);
    } else throw "UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach";
  }
  return s;
}
