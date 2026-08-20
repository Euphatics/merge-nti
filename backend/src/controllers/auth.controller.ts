import type { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { sendEmail } from '../utils/mailer.js';

/**
 * POST /api/auth/register
 * Creates a new School record.
 * Frontend form fields: schoolName, email, username, password
 */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      schoolName,
      email,
      username,
      password,
    } = req.body;

    if (!schoolName || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ── Registration window check ──
    const regWindow = await prisma.registrationWindow.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!regWindow) {
      return res.status(403).json({
        error: 'Registration is currently closed. No registration window has been set by the admin.',
      });
    }

    const now = new Date();
    if (now < regWindow.startDate || now > regWindow.endDate) {
      const fmt = (d: Date) => d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      return res.status(403).json({
        error: `Registration is currently closed. It is open from ${fmt(regWindow.startDate)} to ${fmt(regWindow.endDate)}.`,
      });
    }

    // Check if email already exists
    const emailExists = await prisma.school.findUnique({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ error: 'School Email already exists' });
    }

    // Check if username already exists
    const usernameExists = await prisma.school.findUnique({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ error: 'Username exists, choose a different username' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create School
    const school = await prisma.school.create({
      data: {
        schoolName,
        email,
        username,
        passwordHash: hashedPassword,
        isProfileComplete: false,
      },
    });

    // Send verification email in background (don't block the response)
    sendEmail({
      email: school.email,
      emailType: 'VERIFY_USER',
      userId: school.id,
    }).catch((err) => console.error('Failed to send verification email:', err));

    return res.status(200).json({ message: 'User entered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/login
 * Validates credentials, checks email verification, issues JWT cookie.
 * Frontend form fields: email (can be email or username), password
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Support login with either email or username
    const fetchedUser = await prisma.school.findFirst({
      where: {
        OR: [{ email }, { username: email }],
      },
    });

    if (!fetchedUser) {
      return res.status(401).json({ error: 'Email doesnt exist' });
    }

    const validPassword = await bcryptjs.compare(password, fetchedUser.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    if (!fetchedUser.isVerified) {
      return res.status(401).json({ error: 'Email is not verified, please verify it first' });
    }

    const tokenData = {
      id: fetchedUser.id,
      username: fetchedUser.username,
    };

    const token = jwt.sign(tokenData, process.env.JWT_TOKEN!, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: fetchedUser.id,
        schoolName: fetchedUser.schoolName,
        username: fetchedUser.username,
        email: fetchedUser.email,
        isProfileComplete: fetchedUser.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * POST /api/auth/logout
 * Clears the token cookie.
 */
export const logout = async (_req: Request, res: Response) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      expires: new Date(0),
    });
    return res.status(200).json({
      message: 'Logout successfully',
      success: true,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * POST /api/auth/verify-email
 * Validates the verification token from the email link.
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token missing' });
    }

    // verifyToken has a @unique index, so findUnique is safe and efficient
    const user = await prisma.school.findUnique({
      where: { verifyToken: token },
    });

    if (!user || !user.verifyTokenExpiry || user.verifyTokenExpiry <= new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    await prisma.school.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ error: 'Email verification failed' });
  }
};

/**
 * POST /api/auth/forgot-password
 * Sends a password reset email if the account exists.
 * Always returns success to prevent email enumeration.
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please send the email id' });
    }

    const user = await prisma.school.findUnique({ where: { email } });

    if (user) {
      // Send reset email in background (don't block the response)
      sendEmail({
        email: user.email,
        emailType: 'RESET_PASSWORD',
        userId: user.id,
      }).catch((err) => console.error('Failed to send reset email:', err));
    }

    return res.status(200).json({
      message: 'If an account exists, then a reset link has been sent to it',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * POST /api/auth/reset-password
 * Validates the reset token and updates the password.
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Invalid request- Token or password not found' });
    }

    // forgotPasswordToken has a @unique index, so findUnique is safe
    const user = await prisma.school.findUnique({
      where: { forgotPasswordToken: token },
    });

    if (!user || !user.forgotPasswordTokenExpiry || user.forgotPasswordTokenExpiry <= new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.school.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * GET /api/auth/registration-status
 * Public endpoint — returns whether registration is currently open.
 */
export const getRegistrationStatus = async (_req: Request, res: Response) => {
  try {
    const regWindow = await prisma.registrationWindow.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!regWindow) {
      return res.status(200).json({ isOpen: false, startDate: null, endDate: null });
    }

    const now = new Date();
    const isOpen = now >= regWindow.startDate && now <= regWindow.endDate;

    return res.status(200).json({
      isOpen,
      startDate: regWindow.startDate,
      endDate: regWindow.endDate,
    });
  } catch (error) {
    console.error('Registration status error:', error);
    return res.status(500).json({ error: 'Failed to check registration status' });
  }
};
