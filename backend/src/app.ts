import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { env, allowedOrigins } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import studentRouter from './routes/student.routes.js';
import uploadRouter from './routes/upload.routes.js';
import adminRouter from './routes/admin.routes.js';
import publicRouter from './routes/public.routes.js';

/**
 * Builds the Express application.
 *
 * Kept separate from server start-up so tests can exercise routes without
 * binding a port or connecting to the database.
 */
export function createApp(): Application {
  const app = express();

  // Behind Hostinger's proxy the socket address is the proxy, not the visitor.
  // Without this, express-rate-limit buckets every request together and the
  // auth limiter locks out the whole site at once.
  app.set('trust proxy', env.TRUST_PROXY);
  app.disable('x-powered-by');

  app.use(
    pinoHttp({
      logger,
      // Health checks would otherwise dominate the log at info level.
      autoLogging: { ignore: (req) => req.url === '/health' || req.url === '/api/health' },
    })
  );

  app.use(
    helmet({
      // The API serves JSON, not documents; the SPA carries its own CSP.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hsts: env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
    })
  );

  app.use(compression());

  const origins = allowedOrigins();
  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin, curl and server-to-server requests send no Origin header.
        if (!origin || origins.includes(origin)) {
          callback(null, true);
          return;
        }
        logger.warn({ origin }, 'Blocked cross-origin request from unlisted origin');
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  /** Broad ceiling on API traffic, well above normal use. */
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' },
  });

  /** Tight limit on the credential and token endpoints. */
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: 'Too many attempts. Please try again in a few minutes.' },
  });

  // ── Health ───────────────────────────────────────────────────
  // Deliberately ahead of the rate limiter so uptime checks are never throttled.
  const health = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: Math.round(process.uptime()),
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  };
  app.get('/health', health);
  app.get('/api/health', health);

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'NTI Olympiad API', docs: '/api/health' });
  });

  // ── Routes ───────────────────────────────────────────────────
  app.use('/api', globalLimiter);
  app.use('/api/auth', authLimiter, authRouter);
  app.use('/api/schools', studentRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', uploadRouter);
  app.use('/api', publicRouter);

  // ── Terminal handlers ────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
