// ===== utils/sendEmail.js =====
const createTransporter = require('../config/email');

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${options.fromName || 'KamalTaxPro'} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hello ${user.firstName},</p>
      <p>You recently requested to reset your password for your KamalTaxPro account. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #2563eb;">${resetURL}</p>
      <p><strong>This link will expire in 10 minutes.</strong></p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px;">
        This email was sent by KamalTaxPro. If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - KamalTaxPro',
    html,
    text: `Password Reset Request\n\nHello ${user.firstName},\n\nYou recently requested to reset your password. Please visit: ${resetURL}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
  });
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to KamalTaxPro!</h2>
      <p>Hello ${user.firstName},</p>
      <p>Welcome to KamalTaxPro! We're excited to have you on board.</p>
      <p>You can now access our courses and services with your account:</p>
      <ul>
        <li>Professional tax courses</li>
        <li>Expert consultation services</li>
        <li>Community support</li>
        <li>Regular updates and resources</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login to Your Account</a>
      </div>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px;">
        Thank you for choosing KamalTaxPro for your tax education needs.
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Welcome to KamalTaxPro!',
    html,
    text: `Welcome to KamalTaxPro!\n\nHello ${user.firstName},\n\nWelcome to KamalTaxPro! You can now access our courses and services.\n\nLogin at: ${process.env.CLIENT_URL}/login`
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};