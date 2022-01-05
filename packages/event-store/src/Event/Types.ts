export type EventFactoryPayload<Event extends EventBase> = EventFactoryData<Event> & EventFactoryMeta<Event>;

type EventFactoryData<Event extends EventBase> = Event["data"] extends never
  ? {
      data?: undefined;
    }
  : {
      data: Event["data"];
    };

type EventFactoryMeta<Event extends EventBase> = Event["meta"] extends never
  ? {
      meta?: undefined;
    }
  : {
      meta: Event["meta"];
    };

export type EventBase<EventType = unknown, EventData = unknown | never, EventMeta = unknown | never> = {
  /**
   * Unique event identifier using nanoid.
   */
  id: string;

  /**
   * Event identifier describing the intent of the event in a past
   * tense format.
   */
  type: EventType;

  /**
   * Contains the events data attributes directly related to the
   * event content.
   */
  data: EventData;

  /**
   * Contains additional meta details about the event that is not
   * directly related to its data attributes.
   */
  meta: EventMeta;

  /**
   * Logical hybrid clock timestamp representing the wall time when
   * the event was created.
   */
  created: string;
};

export type EventRecord<Event extends EventBase = EventBase> = Event & {
  /**
   * Entity identifier used to determine the sequence of events.
   */
  entityId: string;

  /**
   * Logical hybrid clock timestamps representing the wall time when
   * the event was recorded.
   */
  recorded: string;
};