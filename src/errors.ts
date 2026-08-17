// src/errors.ts
// Helpers for narrowing `unknown` catch-block errors WITHOUT using `as`.
// TypeScript's strict mode types every catch-block error as `unknown`.
// A type guard (using `is`) proves the shape safely; `as` would just
// assert it and trust us — exactly what section 3.3 forbids using twice.

export function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && 'code' in err;
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
