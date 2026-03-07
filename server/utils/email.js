const nodemailer = require('nodemailer');

// ─── Create transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Send verification email ───────────────────────────────────────────────────
const sendVerificationEmail = async (toEmail, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Ticikitify" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '✅ Verify Your Ticikitify Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#13131a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:2px;">TICIKITIFY</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Event Ticketing Platform</p>
          </div>

          <!-- Body -->
          <div style="padding:40px 32px;">
            <h2 style="color:#fff;font-size:22px;margin:0 0 12px;">Hi ${name || 'there'} 👋</h2>
            <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Welcome to Ticikitify! Please verify your email address to activate your account.
              This link expires in <strong style="color:#fff;">24 hours</strong>.
            </p>

            <!-- Button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${verifyUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;text-decoration:none;padding:14px 40px;border-radius:50px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                ✅ Verify My Email
              </a>
            </div>

            <p style="color:#6b7280;font-size:13px;line-height:1.5;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="background:#1f1f2e;border-radius:8px;padding:12px;word-break:break-all;font-size:12px;color:#7c3aed;margin:8px 0 24px;">
              ${verifyUrl}
            </p>
            
            <p style="color:#6b7280;font-size:13px;">
              If you didn't create an account on Ticikitify, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top:1px solid rgba(255,255,255,0.06);padding:20px 32px;text-align:center;">
            <p style="color:#4b5563;font-size:12px;margin:0;">© 2025 Ticikitify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ─── Send password reset email ─────────────────────────────────────────────────
const sendPasswordResetEmail = async (toEmail, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Ticikitify" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔑 Reset Your Ticikitify Password',
    html: `
      <div style="max-width:560px;margin:40px auto;font-family:Arial,sans-serif;background:#13131a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <div style="background:linear-gradient(135deg,#dc2626,#f97316);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">TICIKITIFY</h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="color:#fff;font-size:22px;margin:0 0 12px;">Password Reset Request</h2>
          <p style="color:#9ca3af;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Hi ${name || 'there'}, we received a request to reset your password. 
            This link expires in <strong style="color:#fff;">1 hour</strong>.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#f97316);color:#fff;text-decoration:none;padding:14px 40px;border-radius:50px;font-size:16px;font-weight:700;">
              🔑 Reset Password
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;">If you didn't request this, ignore this email. Your password won't change.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
