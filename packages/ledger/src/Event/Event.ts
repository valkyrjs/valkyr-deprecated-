export type Event<Type extends string = string, Data extends {} = Empty, Meta extends {} = Empty> = {
  /**
   * Event identifier describing the intent of the event in a past tense format.
   */
  type: Type;

  /**
   * Stores the recorded partial piece of data that makes up a larger aggregate
   * state.
   */
  data: Data extends Empty ? {} : Data;

  /**
   * Stores additional meta data about the event that is not directly related
   * to the aggregate state.
   */
  meta: Meta extends Empty ? {} : Meta;
};

export type EventStatus = {
  /**
   * Does the event already exist in the containing stream. This is an
   * optimization flag so that we can potentially ignore the processing of the
   * event if it already exists.
   */
  exists: boolean;

  /**
   * Is there another event in the stream of the same type that is newer than
   * the provided event. This is passed into projectors so that they can
   * route the event to the correct projection handlers.
   *
   * @see {@link Projection [once|on|all]}
   */
  outdated: boolean;
};

export type EventAuditor = {
  auditor: string;
};

export type Empty = Record<string, never>;
