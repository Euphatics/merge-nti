import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface SchoolRequest extends Request {
  school?: { id: number; username: string };
}

/**
 * Middleware that protects school-only routes.
 * Reads the JWT from the `token` HttpOnly cookie set during login.
 * Ensures the authenticated school's ID matches the `:schoolId` route param.
 */
export const schoolAuth = (req: SchoolRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const jwtSecret = process.env.JWT_TOKEN;
    if (!jwtSecret) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded: any = (jwt.verify as any)(token, jwtSecret);

    if (!decoded.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // If the route has a :schoolId param, verify it matches the token
    const paramSchoolId = req.params.schoolId;
    if (paramSchoolId) {
      const requestedId = parseInt(paramSchoolId as string, 10);
      if (isNaN(requestedId)) {
        res.status(400).json({ error: 'Invalid school ID' });
        return;
      }
      if (requestedId !== decoded.id) {
        res.status(403).json({ error: 'Access denied. You can only access your own school data.' });
        return;
      }
    }

    req.school = { id: decoded.id, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};
