import nodemailer from 'nodemailer';

interface SendMailOptions {
  to:      string;
  subject: string;
  html:    string;
}

/**
 * Send an email via SMTP (nodemailer).
 * In development (no SMTP config), falls back to logging the email to the console.
 */
export async function sendMail({ to, subject, html }: SendMailOptions): Promise<void> {
  const smtpHost = process.env['SMTP_HOST'];
  const smtpUser = process.env['SMTP_USER'];
  const smtpPass = process.env['SMTP_PASS'];

  // Dev/fallback: log to console instead of sending
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 [Email - Dev Mode] No SMTP configured, logging to console:');
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    // Strip HTML tags for console readability
    console.log(`   Body:    ${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env['SMTP_PORT'] ?? 587),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"${process.env['SMTP_FROM_NAME'] ?? 'Hussein Ghulam Motors'}" <${smtpUser}>`,
    to,
    subject,
    html,
  });
}
