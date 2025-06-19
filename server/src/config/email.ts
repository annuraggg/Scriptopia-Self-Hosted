import nodemailer, { SentMessageInfo } from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;
const USER_EMAIL = process.env.GOOGLE_USER_EMAIL as string;

// Setup OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Email options interface
interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send Email using Nodemailer & OAuth2
 * @param {SendEmailOptions} options - Email sending options
 * @returns {Promise<SentMessageInfo>} - Result of the email send operation
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SentMessageInfo> {
  try {
    const { to, subject, text, html = "" } = options;

    // Get valid access token
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) throw new Error("Failed to obtain access token");

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Send email
    const result = await transporter.sendMail({
      from: `Team Scriptopia <${USER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
