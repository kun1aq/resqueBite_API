const { Resend } = require("resend");
const env = require("../config/env");

const resend = new Resend(env.RESEND_API_KEY);

async function sendVerificationEmail({ to, token }) {
  const verificationUrl = `${env.APP_URL}/auth/verify-email-link?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Verify your RescueBite account",
    html: `
    <h2>Welcome to RescueBite</h2>
    <p>Please use this code to verify your email:</p>
    <h1 style="letter-spacing: 4px;">${token}</h1>
    <p>This code expires in 30 minutes.</p>
    `
  });

  if (error) {
    throw new Error(error.message || "Failed to send verification email");
  }

  return data;
}

module.exports = {
  sendVerificationEmail
};