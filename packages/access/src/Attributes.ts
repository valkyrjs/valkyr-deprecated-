type MappedFlags = Record<string, number>;

export class Attributes<Flags extends MappedFlags = MappedFlags> {
  constructor(public readonly flags: Flags, private flag = 0) {}

  /**
   * Check if the flag exists on the flags object.
   */
  public has(flag: keyof Flags) {
    return (this.flag & this.flags[flag]) === this.flags[flag];
  }

  /**
   * Set given list of flags as true on the attributes instance.
   */
  public enable(flags: (keyof Flags)[]) {
    for (const flag of flags) {
      this.flag |= this.flags[flag];
    }
    return this;
  }

  /**
   * Remove list of flags from the list under the residing filter key.
   */
  public disable(flags: (keyof Flags)[]) {
    for (const flag of flags) {
      this.flag &= ~this.flags[flag];
    }
    return this;
  }

  /**
   * Filter provided document against the rules of residing filter key.
   */
  public filter<Document extends Record<keyof Flags, unknown>>(document: Document) {
    const data: Partial<Document> = { ...document };
    for (const key in this.flags) {
      if (this.has(key) === false) {
        delete data[key];
      }
    }
    return data;
  }

  /**
   * Get current bitflag value.
   */
  public toNumber(): number {
    return this.flag;
  }
}
