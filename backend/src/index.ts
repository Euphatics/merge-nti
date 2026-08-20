import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import prisma from './config/prisma.js';
import { validateEnv } from './config/validateEnv.js';
import authRouter from './routes/auth.routes.js';
import studentRouter from './routes/student.routes.js';
import paymentRouter from './routes/payment.routes.js';
import uploadRouter from './routes/upload.routes.js';
import adminRouter from './routes/admin.routes.js';
import resultRouter from './routes/result.routes.js';
import galleryRouter from './routes/gallery.routes.js';

// Load environment variables
dotenv.config();

// Validate required env vars before anything else
validateEnv();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ── Rate limiters ──────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: { error: 'Too many attempts. Please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Middleware ──────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://olympiad-sooty.vercel.app',
  'https://olympiad-vaxr-ten.vercel.app',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.resolve('uploads')));

// ── Routes ─────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.send({ message: 'Olympiad Backend API is running.' });
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/schools', studentRouter);
app.use('/api', paymentRouter);
app.use('/api', uploadRouter);
app.use('/api', resultRouter);
app.use('/api/admin', adminRouter);
app.use('/api/gallery', galleryRouter);

// ── Start server ───────────────────────────────────────────────
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully…`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Database disconnected. Goodbye.');
      process.exit(0);
    });
    // Force exit after 10s if graceful shutdown stalls
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
