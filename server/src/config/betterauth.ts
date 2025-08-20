import "dotenv/config";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { sendEmail } from "./email";
import { customSession } from "better-auth/plugins";
import User from "@/models/User";

const client = new MongoClient(process.env.MONGO_URI!);
const db = client.db(process.env.MONGO_DB);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { 
    enabled: true, 
    requireEmailVerification: true,
    forgotPasswordLink: `${process.env.ACCOUNTS_FRONTEND_URL}/reset-password`,
    sendResetPassword: async ({ user, token }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${process.env.ACCOUNTS_FRONTEND_URL}/reset-password?token=${token}`,
      });
    },
  },
  basePath: "/users/auth",
  user: {
    modelName: "users",
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, token }) => {
        await sendEmail({
          to: user.email,
          subject: "Change your email",
          text: `Click the link to confirm your email change: ${process.env.ACCOUNTS_FRONTEND_URL}/change-email?token=${token}`,
        });
      },
    },
  },
  trustedOrigins: [
    process.env.MAIN_FRONTEND_URL!,
    process.env.SCRIPTOPIA_FRONTEND_URL!,
    process.env.ENTERPRISE_FRONTEND_URL!,
    process.env.CAMPUS_FRONTEND_URL!,
    process.env.MEET_FRONTEND_URL!,
    process.env.CANDIDATE_FRONTEND_URL!,
    process.env.ACCOUNTS_FRONTEND_URL!,
  ],
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, token }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${process.env.ACCOUNTS_FRONTEND_URL}/verify-email?token=${token}`,
      });
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const publicMetadata = await User.findById(user.id)
        .select("publicMetadata")
        .lean();
      return {
        user: { ...user, publicMetadata },
        session,
      };
    }),
  ],
});
