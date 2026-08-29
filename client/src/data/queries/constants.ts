/**
 * Query cache time constants in milliseconds
 */
export const CACHE_TIMES = {
  /** 1 minute - for frequently changing data */
  SHORT: 1 * 60 * 1000,
  /** 2 minutes - for moderately changing data */
  MEDIUM: 2 * 60 * 1000,
  /** 5 minutes - for slowly changing data */
  LONG: 5 * 60 * 1000,
} as const;