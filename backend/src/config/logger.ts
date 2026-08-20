import pino from 'pino';
import { env } from './env.js';

/**
 * Structured application logger.
 *
 * Pretty-printed locally for readability; newline-delimited JSON in production
 * so hPanel's log viewer and any downstream collector can parse it.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
      }
    : {}),
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'req.body.password',
      'req.body.token',
      'res.headers["set-cookie"]',
    ],
    censor: '[redacted]',
  },
});
