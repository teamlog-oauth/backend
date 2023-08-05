import { CookieOptions } from 'express';

export const REFRESH_COOKIE_NAME = 'Refresh';

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
