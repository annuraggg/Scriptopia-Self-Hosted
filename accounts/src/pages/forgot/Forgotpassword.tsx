import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { authClient } from "../../config/auth-client";

interface ForgotPasswordProps {
  onNavigate?: (path: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/reset-password`, // This would be the reset password page
      });
      setIsSuccess(true);
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  scriptopia
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600">
                We've sent a password reset link to {email}
              </p>
            </div>

            <div className="flex justify-center my-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                Click the link in the email to reset your password. If you don't
                see the email, check your spam folder.
              </p>
              <p className="text-sm text-gray-500">
                Didn't receive the email? You can resend it or try a different
                email address.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Resend email
              </button>

              <button
                onClick={() => onNavigate?.("/sign-in")}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                scriptopia
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset your password
            </h2>
            <p className="text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="mt-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm"
                  placeholder=""
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Sending reset link...
                  </div>
                ) : (
                  "CONTINUE"
                )}
              </button>
            </form>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => onNavigate?.("/sign-in")}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Sign in
                </button>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
