/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type JSONFlags = Record<string, number>;

type JSONFilters = { $all?: number } & Record<string, number>;

/*
 |--------------------------------------------------------------------------------
 | Attributes
 |--------------------------------------------------------------------------------
 */

export abstract class Attributes<Flags extends JSONFlags = JSONFlags, Filters extends JSONFilters = JSONFilters> {
  public readonly flags: Flags;
  public readonly filters: Filters;

  constructor(flags: Flags, filters: Filters) {
    this.flags = flags;
    this.filters = {
      $all: createAllFilter(flags),
      ...filters
    };
  }

  /**
   * Check if given flag has been set under the residing filter key.
   */
  public has(filter: keyof Filters, flag: keyof Flags) {
    return (this.filters[filter] & this.flags[flag]) === this.flags[flag];
  }

  /**
   * Add list of flags to the list under the residing filter key.
   */
  public add(filter: keyof Filters, flags: (keyof Flags)[]) {
    for (const flag of flags) {
      (this.filters as any)[filter] |= this.flags[flag];
    }
    return this;
  }

  /**
   * Remove list of flags from the list under the residing filter key.
   */
  public del(filter: keyof Filters, flags: (keyof Flags)[]) {
    for (const flag of flags) {
      (this.filters as any)[filter] &= ~this.flags[flag];
    }
    return this;
  }

  /**
   * Filter provided document against the rules of residing filter key.
   */
  public filter<Document extends Record<keyof Flags, unknown>>(filter: keyof Filters, document: Document) {
    const data: Partial<Document> = { ...document };
    for (const key in this.flags) {
      if (this.has(filter, key) === false) {
        delete data[key];
      }
    }
    return data;
  }

  /**
   * Get a JSON representation of the access attributes instance.
   */
  public toJSON(): Filters {
    return {
      ...this.filters,
      $all: undefined
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function createAllFilter<Flags extends JSONFlags>(flags: Flags): number {
  let filter = 0;
  for (const key in flags) {
    filter |= flags[key];
  }
  return filter;
}
