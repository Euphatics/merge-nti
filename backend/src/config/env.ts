import { z } from 'zod';

/**
 * Schema for every environment variable the server reads.
 *
 * Parsed once at startup so a misconfigured deployment fails immediately with a
 * readable message instead of throwing somewhere deep in a request handler.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_TOKEN: z
    .string()
    .min(32, 'JWT_TOKEN must be at least 32 characters. Generate one with: openssl rand -hex 32'),

  ADMIN_USERNAME: z.string().min(1, 'ADMIN_USERNAME is required'),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(/^\$2[aby]\$/, 'ADMIN_PASSWORD_HASH must be a bcrypt hash (starts with $2a$, $2b$ or $2y$)'),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  /** Primary frontend origin. Used for CORS and for links in outgoing emails. */
  CLIENT_URL: z.string().url('CLIENT_URL must be a full URL, e.g. https://ntiolympiad.in'),

  /** Optional comma-separated list of additional allowed CORS origins. */
  ADDITIONAL_ORIGINS: z.string().optional(),

  GOOGLE_APPS_SCRIPT_URL: z.string().url().optional(),

  /**
   * Cookie attributes. The frontend and API sit on different origins in
   * production (ntiolympiad.in vs api.ntiolympiad.in), so these must be
   * tunable per environment rather than hardcoded.
   */
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),

  /** Number of proxy hops in front of the app. Required for correct rate limiting. */
  TRUST_PROXY: z.coerce.number().int().min(0).default(1),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

/**
 * Parses and returns the validated environment.
 *
 * On failure this prints every problem at once — a deploy with three missing
 * variables should not require three deploy cycles to discover them.
 */
export function loadEnv(): Env {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('\n❌ Invalid environment configuration:\n');
    for (const issue of parsed.error.issues) {
      console.error(`   • ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
    console.error('\nSee backend/.env.example for the full list of required variables.\n');
    process.exit(1);
  }

  cached = parsed.data;
  return cached;
}

/** The validated environment. Import this instead of touching `process.env`. */
export const env: Env = loadEnv();

/** Every origin allowed to make credentialed cross-origin requests. */
export function allowedOrigins(): string[] {
  const stripSlash = (u: string) => u.replace(/\/$/, '');
  const origins = [stripSlash(env.CLIENT_URL)];

  if (env.ADDITIONAL_ORIGINS) {
    for (const origin of env.ADDITIONAL_ORIGINS.split(',')) {
      const trimmed = stripSlash(origin.trim());
      if (trimmed) origins.push(trimmed);
    }
  }

  // Local Vite dev servers, only outside production.
  if (env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175');
  }

  return [...new Set(origins)];
}
