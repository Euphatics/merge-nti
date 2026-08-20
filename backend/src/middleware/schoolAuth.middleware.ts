import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface SchoolRequest extends Request {
  school?: { id: number; username: string };
}

interface SchoolTokenPayload {
  id: number;
  username: string;
}

/**
 * Protects school-only routes using the JWT in the HttpOnly `token` cookie.
 *
 * When the route carries a `:schoolId`, it must match the token — otherwise any
 * signed-in school could read another school's students and payments.
 */
export const schoolAuth = (req: SchoolRequest, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    next(ApiError.unauthorized());
    return;
  }

  let decoded: SchoolTokenPayload;
  try {
    // jwt.verify throws on expiry/signature failure; the error handler maps
    // TokenExpiredError and JsonWebTokenError to distinct 401 messages.
    decoded = jwt.verify(token, env.JWT_TOKEN) as SchoolTokenPayload;
  } catch (err) {
    next(err);
    return;
  }

  if (typeof decoded.id !== 'number') {
    next(ApiError.unauthorized('Invalid session. Please log in again.'));
    return;
  }

  const paramSchoolId = req.params.schoolId;
  if (paramSchoolId !== undefined) {
    const requestedId = Number(paramSchoolId);
    if (!Number.isInteger(requestedId) || requestedId <= 0) {
      next(ApiError.badRequest('Invalid school ID'));
      return;
    }
    if (requestedId !== decoded.id) {
      next(ApiError.forbidden('You can only access your own school data.'));
      return;
    }
  }

  req.school = { id: decoded.id, username: decoded.username };
  next();
};
