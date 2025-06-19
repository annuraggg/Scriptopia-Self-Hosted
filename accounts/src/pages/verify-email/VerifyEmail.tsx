import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { authClient } from "../../config/auth-client";

interface EmailVerificationProps {
  onNavigate?: (path: string) => void;
}

type VerificationStatus = "verifying" | "success" | "error" | "expired";

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onNavigate,
}) => {
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      verifyEmail(token);
    } else {
      setStatus("error");
      setError("No verification token provided");
    }
  }, []);

  const verifyEmail = async (verificationToken: string) => {
    try {
      await authClient.verifyEmail({ query: { token: verificationToken } });
      setStatus("success");
    } catch (err: any) {
      if (err.message?.includes("expired")) {
        setStatus("expired");
      } else {
        setStatus("error");
        setError(err.message || "Verification failed");
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      console.log("Resending verification email...");
    } catch (err) {
      console.error("Failed to resend verification:", err);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email verified!
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now sign in to
              your account.
            </p>
            <button
              onClick={() => onNavigate?.("/sign-in")}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continue to Sign In
            </button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Link expired
            </h2>
            <p className="text-gray-600 mb-6">
              This verification link has expired. Request a new one to verify
              your email address.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate?.("/sign-in")}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification failed
            </h2>
            <p className="text-gray-600 mb-2">
              We couldn't verify your email address.
            </p>
            {error && <p className="text-sm text-red-600 mb-6">{error}</p>}
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Send new verification email
              </button>
              <button
                onClick={() => onNavigate?.("/sign-in")}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-2 justify-center mb-8">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <link rel="icon" type="image/svg+xml" href="/logo.svg" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Scriptopia
            </span>
          </div>

          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
