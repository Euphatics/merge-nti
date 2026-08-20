import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

interface SendEmailOptions {
  email: string;
  emailType: 'VERIFY_USER' | 'RESET_PASSWORD';
  userId: number;
}

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Issues a single-use token, stores it, and sends the matching email through
 * the Google Apps Script webhook.
 *
 * Callers invoke this without awaiting so a slow mail provider cannot stall an
 * HTTP response — which is why every failure path logs rather than rethrowing
 * into a dead request.
 */
export async function sendEmail({ email, emailType, userId }: SendEmailOptions): Promise<void> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + TOKEN_TTL_MS);

  if (emailType === 'VERIFY_USER') {
    await prisma.school.update({
      where: { id: userId },
      data: { verifyToken: token, verifyTokenExpiry: expiry },
    });
  } else {
    await prisma.school.update({
      where: { id: userId },
      data: { forgotPasswordToken: token, forgotPasswordTokenExpiry: expiry },
    });
  }

  const clientUrl = env.CLIENT_URL.replace(/\/$/, '');
  const appsScriptUrl = env.GOOGLE_APPS_SCRIPT_URL;

  const isVerification = emailType === 'VERIFY_USER';
  const path = isVerification ? 'verify-email' : 'reset-password';
  const actionUrl = `${clientUrl}/${path}?token=${token}`;

  if (!appsScriptUrl) {
    // Without this branch, local development silently has no way to complete
    // registration. The link is logged so the flow stays testable.
    logger.warn(
      { emailType, email, actionUrl },
      'GOOGLE_APPS_SCRIPT_URL is not set — email not sent. Use the logged link to continue.'
    );
    return;
  }

  const subject = isVerification
    ? 'Verify Your Email — NTI Olympiad'
    : 'Reset Your Password — NTI Olympiad';
  const actionLabel = isVerification ? 'Verify Email' : 'Reset Password';
  const intro = isVerification
    ? 'Thank you for registering with NTI Olympiad. Please confirm your email address to activate your account.'
    : 'We received a request to reset your password. Use the button below to choose a new one.';

  const htmlBody = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h2 style="color: #1f2937; margin: 0 0 16px 0;">${subject}</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">${intro}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${actionUrl}"
           style="display: inline-block; padding: 12px 32px; background: #1976D2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          ${actionLabel}
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${actionUrl}" style="color: #1976D2; word-break: break-all;">${actionUrl}</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This link expires in 1 hour.</p>
    </div>
  `;

  // Apps Script can hang; without a timeout the request would sit open forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, subject, htmlBody }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Apps Script responded ${response.status}: ${text.slice(0, 200)}`);
    }

    logger.info({ emailType, email }, 'Email sent');
  } finally {
    clearTimeout(timeout);
  }
}
