import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export interface AdminRequest extends Request {
  admin?: { role: 'admin' };
}

/**
 * Protects admin-only routes.
 * Expects `Authorization: Bearer <token>` carrying `{ role: 'admin' }`.
 */
export const adminAuth = (req: AdminRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(ApiError.unauthorized('Admin authentication required.'));
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    next(ApiError.unauthorized('Admin authentication required.'));
    return;
  }

  let decoded: { role?: string };
  try {
    decoded = jwt.verify(token, env.JWT_TOKEN) as { role?: string };
  } catch (err) {
    next(err);
    return;
  }

  // School tokens are signed with the same secret, so the role claim is what
  // actually separates the two audiences.
  if (decoded.role !== 'admin') {
    next(ApiError.forbidden('Access denied. Admin role required.'));
    return;
  }

  req.admin = { role: 'admin' };
  next();
};
