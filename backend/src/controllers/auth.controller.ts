import type { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { clearCookieOptions, sessionCookieOptions, SESSION_EXPIRES_IN } from '../config/cookies.js';
import { sendEmail } from '../utils/mailer.js';
import { ApiError } from '../utils/ApiError.js';
import type { SchoolRequest } from '../middleware/schoolAuth.middleware.js';

const BCRYPT_ROUNDS = 10;

/**
 * A real bcrypt hash of a throwaway string, compared against when no account
 * matches. A malformed hash would return `false` immediately and leave the
 * "no such school" path measurably faster than the "wrong password" path.
 */
const TIMING_EQUALISATION_HASH = '$2b$10$pQ7wW81xy4Xa3vpq7iZjZui1fasVCJSxBGHv9Jn0lzQkBqRWKrdHa';

/** The school fields safe to return to the browser. Never includes the hash. */
function publicSchool(school: {
  id: number;
  schoolName: string;
  username: string;
  email: string;
  status: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  isListLocked: boolean;
}) {
  return {
    id: school.id,
    schoolName: school.schoolName,
    username: school.username,
    email: school.email,
    status: school.status,
    isVerified: school.isVerified,
    isProfileComplete: school.isProfileComplete,
    isListLocked: school.isListLocked,
  };
}

/**
 * POST /api/auth/register
 * Creates a School in PENDING status and emails a verification link.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { schoolName, email, username, password } = req.body;

  const regWindow = await prisma.registrationWindow.findFirst({ orderBy: { id: 'desc' } });

  if (!regWindow) {
    throw ApiError.forbidden(
      'Registration is currently closed. No registration window has been set by the admin.'
    );
  }

  const now = new Date();
  if (now < regWindow.startDate || now > regWindow.endDate) {
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    throw ApiError.forbidden(
      `Registration is currently closed. It is open from ${fmt(regWindow.startDate)} to ${fmt(regWindow.endDate)}.`
    );
  }

  // Checked explicitly so the messages name the offending field; the unique
  // indexes still backstop this against a race between the check and the insert.
  const [emailExists, usernameExists] = await Promise.all([
    prisma.school.findUnique({ where: { email }, select: { id: true } }),
    prisma.school.findUnique({ where: { username }, select: { id: true } }),
  ]);

  if (emailExists) throw ApiError.conflict('An account with this email already exists.');
  if (usernameExists) throw ApiError.conflict('That username is taken. Please choose another.');

  const passwordHash = await bcryptjs.hash(password, BCRYPT_ROUNDS);

  const school = await prisma.school.create({
    data: { schoolName, email, username, passwordHash, isProfileComplete: false },
  });

  // Sent in the background so a slow mail provider does not stall the response.
  sendEmail({ email: school.email, emailType: 'VERIFY_USER', userId: school.id }).catch((err) =>
    logger.error({ err, schoolId: school.id }, 'Failed to send verification email')
  );

  res.status(201).json({
    message: 'Registration successful. Check your email for a verification link.',
  });
};

/**
 * POST /api/auth/login
 * Accepts an email address or a username. Issues the session cookie.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const identifier = email.toLowerCase();

  const school = await prisma.school.findFirst({
    where: { OR: [{ email: identifier }, { username: email }] },
  });

  // A single generic message for both "no such account" and "wrong password",
  // so the endpoint cannot be used to enumerate registered schools.
  const invalid = ApiError.unauthorized('Incorrect email/username or password.');
  if (!school) {
    // Equalise timing against the bcrypt comparison on the success path.
    await bcryptjs.compare(password, TIMING_EQUALISATION_HASH);
    throw invalid;
  }

  const validPassword = await bcryptjs.compare(password, school.passwordHash);
  if (!validPassword) throw invalid;

  if (!school.isVerified) {
    throw ApiError.forbidden('Your email is not verified yet. Please use the link we emailed you.');
  }

  // Approval status was previously never checked, so a rejected school could
  // still sign in and use the panel as normal.
  if (school.status === 'REJECTED') {
    throw ApiError.forbidden(
      'This school registration was not approved. Please contact the NTI Olympiad team.'
    );
  }

  const token = jwt.sign({ id: school.id, username: school.username }, env.JWT_TOKEN, {
    expiresIn: SESSION_EXPIRES_IN,
  });

  res.cookie('token', token, sessionCookieOptions());
  res.status(200).json({ message: 'Login successful', user: publicSchool(school) });
};

/**
 * GET /api/auth/me
 * Returns the signed-in school, or 401 once the session has expired.
 * The frontend uses this to restore state on load instead of trusting
 * a localStorage copy that outlives the cookie.
 */
export const me = async (req: SchoolRequest, res: Response): Promise<void> => {
  const school = await prisma.school.findUnique({ where: { id: req.school!.id } });
  if (!school) throw ApiError.unauthorized('Your account no longer exists.');

  res.status(200).json({ user: publicSchool(school) });
};

/** POST /api/auth/logout */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.cookie('token', '', clearCookieOptions());
  res.status(200).json({ message: 'Logged out successfully', success: true });
};

/** POST /api/auth/verify-email */
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  const school = await prisma.school.findUnique({ where: { verifyToken: token } });

  if (!school || !school.verifyTokenExpiry || school.verifyTokenExpiry <= new Date()) {
    throw ApiError.badRequest('This verification link is invalid or has expired.');
  }

  await prisma.school.update({
    where: { id: school.id },
    data: { isVerified: true, verifyToken: null, verifyTokenExpiry: null },
  });

  res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
};

/**
 * POST /api/auth/forgot-password
 * Always reports success so the endpoint cannot confirm which emails exist.
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const school = await prisma.school.findUnique({ where: { email } });

  if (school) {
    sendEmail({ email: school.email, emailType: 'RESET_PASSWORD', userId: school.id }).catch((err) =>
      logger.error({ err, schoolId: school.id }, 'Failed to send password reset email')
    );
  }

  res.status(200).json({
    message: 'If an account exists for that email, a reset link has been sent to it.',
  });
};

/** POST /api/auth/reset-password */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  const school = await prisma.school.findUnique({ where: { forgotPasswordToken: token } });

  if (
    !school ||
    !school.forgotPasswordTokenExpiry ||
    school.forgotPasswordTokenExpiry <= new Date()
  ) {
    throw ApiError.badRequest('This reset link is invalid or has expired.');
  }

  const passwordHash = await bcryptjs.hash(password, BCRYPT_ROUNDS);

  await prisma.school.update({
    where: { id: school.id },
    data: { passwordHash, forgotPasswordToken: null, forgotPasswordTokenExpiry: null },
  });

  // Any existing session belongs to whoever knew the old password.
  res.cookie('token', '', clearCookieOptions());
  res.status(200).json({ message: 'Password reset successful. Please log in.' });
};

/**
 * GET /api/auth/registration-status
 * Public — tells the register page whether to show the form.
 */
export const getRegistrationStatus = async (_req: Request, res: Response): Promise<void> => {
  const regWindow = await prisma.registrationWindow.findFirst({ orderBy: { id: 'desc' } });

  if (!regWindow) {
    res.status(200).json({ isOpen: false, startDate: null, endDate: null });
    return;
  }

  const now = new Date();
  res.status(200).json({
    isOpen: now >= regWindow.startDate && now <= regWindow.endDate,
    startDate: regWindow.startDate,
    endDate: regWindow.endDate,
  });
};
