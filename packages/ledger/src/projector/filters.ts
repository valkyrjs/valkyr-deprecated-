export const FILTER_ONCE = Object.freeze<ProjectionFilter>({
  allowHydratedEvents: false,
  allowOutdatedEvents: false
});

export const FILTER_CONTINUOUS = Object.freeze<ProjectionFilter>({
  allowHydratedEvents: true,
  allowOutdatedEvents: false
});

export const FILTER_ALL = Object.freeze<ProjectionFilter>({
  allowHydratedEvents: true,
  allowOutdatedEvents: true
});

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type ProjectionFilter = {
  /**
   * Hydrated events represents events that are not seen for the first time
   * in the entirety of its lifetime across all distributed instances.
   */
  allowHydratedEvents: boolean;

  /**
   * Outdated events represents events that have already seen the same type
   * at a later occurrence. Eg. If incoming event is older than the latest
   * local event of the same type, it is considered outdated.
   */
  allowOutdatedEvents: boolean;
};
