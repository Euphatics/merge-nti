import { z } from 'zod';
import { requiredString } from './common.js';

/**
 * Password policy for school accounts.
 *
 * Deliberately length-first rather than a symbol-class maze: it is the factor
 * that actually resists guessing, and it does not push coordinators toward
 * writing the password on a sticky note.
 */
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .refine((v) => /[a-zA-Z]/.test(v), 'Password must contain at least one letter')
  .refine((v) => /[0-9]/.test(v), 'Password must contain at least one number');

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(255, 'Email is too long')
  .pipe(z.email('Enter a valid email address'));

export const registerSchema = z.object({
  schoolName: requiredString(255, 'School name'),
  email,
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must be at most 100 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username may only contain letters, numbers, dots, underscores and hyphens'),
  password,
});

export const loginSchema = z.object({
  // Accepts either an email address or a username, so no format check here.
  email: requiredString(255, 'Email or username'),
  password: z.string().min(1, 'Password is required').max(128),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().length(64, 'Invalid verification token'),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().trim().length(64, 'Invalid reset token'),
  password,
});
