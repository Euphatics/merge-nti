import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/** Terminal 404 handler. Runs after every route, so it always returns JSON. */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Translates a thrown error into a JSON response.
 *
 * Without this, Express's default handler replies with an HTML error page — which
 * every `fetch()` in the frontend then fails to parse as JSON, turning a clear
 * "file too large" into an opaque crash.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { status, message, details } = classify(err);

  if (status >= 500) {
    logger.error({ err, method: req.method, url: req.originalUrl }, 'Unhandled request error');
  } else {
    logger.warn({ method: req.method, url: req.originalUrl, status, message }, 'Request rejected');
  }

  const body: Record<string, unknown> = { error: message };
  if (details !== undefined) body.details = details;

  // Stack traces are useful locally and a disclosure risk in production.
  if (status >= 500 && env.NODE_ENV === 'development' && err instanceof Error) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

function classify(err: unknown): { status: number; message: string; details?: unknown } {
  if (err instanceof ApiError) {
    return { status: err.status, message: err.message, details: err.details };
  }

  if (err instanceof ZodError) {
    return {
      status: 400,
      message: 'Validation failed',
      details: err.issues.map((i) => ({
        field: i.path.join('.') || '(body)',
        message: i.message,
      })),
    };
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return { status: 413, message: 'File is too large. The maximum upload size is 15 MB.' };
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return { status: 400, message: `Unexpected file field "${err.field}". Use the field name "file".` };
    }
    return { status: 400, message: `Upload failed: ${err.message}` };
  }

  if (err instanceof jwt.TokenExpiredError) {
    return { status: 401, message: 'Your session has expired. Please log in again.' };
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return { status: 401, message: 'Invalid session. Please log in again.' };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 unique constraint, P2025 record not found — safe to surface as 4xx.
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[] | undefined)?.join(', ');
      return { status: 409, message: target ? `That ${target} is already in use.` : 'That value is already in use.' };
    }
    if (err.code === 'P2025') {
      return { status: 404, message: 'The requested record no longer exists.' };
    }
    if (err.code === 'P2003') {
      return { status: 400, message: 'Referenced record does not exist.' };
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // Almost always a bug in our query, not the client's request.
    return { status: 500, message: 'Internal server error' };
  }

  // Errors raised by multer's fileFilter arrive as plain Errors.
  if (err instanceof Error && err.message.startsWith('Only image files')) {
    return { status: 400, message: err.message };
  }

  return { status: 500, message: 'Internal server error' };
}
