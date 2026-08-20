import crypto from 'crypto';
import prisma from '../config/prisma.js';

interface SendEmailOptions {
  email: string;
  emailType: 'VERIFY_USER' | 'RESET_PASSWORD';
  userId: number;
}

export async function sendEmail({ email, emailType, userId }: SendEmailOptions): Promise<void> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Store the token in the database
  if (emailType === 'VERIFY_USER') {
    await prisma.school.update({
      where: { id: userId },
      data: {
        verifyToken: token,
        verifyTokenExpiry: expiry,
      },
    });
  } else if (emailType === 'RESET_PASSWORD') {
    await prisma.school.update({
      where: { id: userId },
      data: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: expiry,
      },
    });
  }

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    console.warn('[Mailer] GOOGLE_APPS_SCRIPT_URL not set in .env — skipping email send');
    console.log(`[Mailer] Would have sent ${emailType} email to ${email} with token: ${token}`);
    return;
  }

  const subject =
    emailType === 'VERIFY_USER'
      ? 'Verify Your Email — NTI Olympiad'
      : 'Reset Your Password — NTI Olympiad';

  const actionUrl =
    emailType === 'VERIFY_USER'
      ? `${clientUrl}/verify-email?token=${token}`
      : `${clientUrl}/reset-password?token=${token}`;

  const actionLabel =
    emailType === 'VERIFY_USER' ? 'Verify Email' : 'Reset Password';

  const htmlBody = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h2 style="color: #1f2937; margin: 0 0 16px 0;">${subject}</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        ${emailType === 'VERIFY_USER'
          ? 'Thank you for registering with NTI Olympiad. Please click the button below to verify your email address.'
          : 'We received a request to reset your password. Click the button below to set a new password.'}
      </p>
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
      <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This link will expire in 1 hour.</p>
    </div>
  `;

  // Send email via Google Apps Script web app
  const response = await fetch(appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject,
      htmlBody,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Apps Script email failed: ${response.status} — ${text}`);
  }

  console.log(`[Mailer] ${emailType} email sent to ${email} via Google Apps Script`);
}
