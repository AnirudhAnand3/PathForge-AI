import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

export const sendOTPEmail = async (email, name, otp) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"PathForge AI" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: 'Verify your PathForge account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#0a0a0f;color:#fff;padding:40px;border-radius:16px">
        <h1 style="font-size:24px;margin-bottom:8px">PathForge AI</h1>
        <p style="color:#9ca3af">Your career co-pilot</p>
        <h2 style="font-size:20px;margin:24px 0 8px">Hey ${name}!</h2>
        <p style="color:#d1d5db">Use the OTP below to verify your email.</p>
        <div style="background:#111;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <div style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#6366f1">${otp}</div>
          <p style="color:#6b7280;font-size:12px;margin:8px 0 0">Expires in 10 minutes</p>
        </div>
      </div>
    `,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"PathForge AI" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: 'Welcome to PathForge AI!',
    html:    `<div style="font-family:sans-serif;padding:40px"><h1>Welcome, ${name}!</h1><p>Your journey starts now.</p></div>`,
  });
};