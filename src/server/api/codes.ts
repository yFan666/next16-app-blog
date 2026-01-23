export const COMMON_CODE = {
  OK: 0,
  UNKNOWN: 10999,
} as const;

export const AUTH_CODE = {
  LOGIN_FAILED: 11001,
  UNAUTHORIZED: 11002,
} as const;

export const POSTS_CODE = {
  INVALID_TITLE: 21001,
  INVALID_AUTHOR_EMAIL: 21002,
  UNKNOWN: 21999,
} as const;
