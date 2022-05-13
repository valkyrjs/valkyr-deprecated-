import { clone } from "@valkyr/utils";

type BitFlags = Record<string, number>;

export class Attributes<Flags extends BitFlags = BitFlags> {
  #flags: Flags;
  #flag: number;

  constructor(flags: Flags, flag = 0) {
    this.#flags = flags;
    this.#flag = flag;
  }

  /**
   * Check if the flag exists on the flags object.
   */
   has(flag: keyof Flags) {
    return (this.#flag & this.#flags[flag]) === this.#flags[flag];
  }

  /**
   * Set given list of flags as true on the attributes instance.
   */
   enable(flags: (keyof Flags)[]) {
    for (const flag of flags) {
      this.#flag |= this.#flags[flag];
    }
    return this;
  }

  /**
   * Remove list of flags from the list under the residing filter key.
   */
   disable(flags: (keyof Flags)[]) {
    for (const flag of flags) {
      this.#flag &= ~this.#flags[flag];
    }
    return this;
  }

  /**
   * Filter provided document against the rules of residing filter key.
   */
   filter<Document extends Record<keyof Flags, unknown>>(document: Document) {
    const data: Partial<Document> = clone(document);
    for (const key in this.#flags) {
      if (this.has(key) === false) {
        delete data[key];
      }
    }
    return data;
  }

  /**
   * Get current bitflag value.
   */
   toNumber(): number {
    return this.#flag;
  }
}
