import type { CookieOptions } from 'express';
import { env } from './env.js';

/**
 * Session lifetime, shared between the JWT expiry and the cookie Max-Age so the
 * two can never drift apart.
 *
 * The previous 1-hour window logged schools out mid-way through uploading
 * student lists, with no visible error.
 */
export const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours
export const SESSION_EXPIRES_IN = '12h';

/**
 * Options for the session cookie.
 *
 * `secure` defaults to on in production but stays overridable, because the
 * cookie is rejected by browsers over plain HTTP — which is what local
 * development and some staging setups use.
 */
export function sessionCookieOptions(): CookieOptions {
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: env.COOKIE_SAMESITE,
    secure: env.COOKIE_SECURE || env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS,
  };

  // Set only when the API and frontend share a registrable domain
  // (e.g. .ntiolympiad.in covering both the apex and the api. subdomain).
  if (env.COOKIE_DOMAIN) {
    options.domain = env.COOKIE_DOMAIN;
  }

  return options;
}

/** Matching options for clearing the cookie — must agree on domain/path/flags. */
export function clearCookieOptions(): CookieOptions {
  const { maxAge: _maxAge, ...rest } = sessionCookieOptions();
  return { ...rest, expires: new Date(0) };
}
