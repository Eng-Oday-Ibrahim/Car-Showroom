import crypto from 'crypto';
import { UserRepository } from '../../infrastructure/user.repository';
import { sendMail } from '../../../../shared/email/mailer';

export class ForgotPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userRepo.findByEmail(normalizedEmail);

    // Always return success to prevent email enumeration attacks
    if (!user || !user.id) return;

    // Generate a secure random token
    const rawToken  = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry    = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepo.setResetToken(user.id, tokenHash, expiry);

    const appUrl   = process.env['APP_URL'] ?? 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

    await sendMail({
      to:      user.email,
      subject: 'Reset your password — Hussein Ghulam Motors',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #6b7280; margin-bottom: 24px;">
            We received a request to reset the password for your account (<strong>${user.email}</strong>).
            Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="color: #9ca3af; font-size: 13px;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will not change.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #d1d5db; font-size: 12px;">
            Hussein Ghulam Motors — husseinghulammotors.com
          </p>
        </div>
      `,
    });
  }
}
