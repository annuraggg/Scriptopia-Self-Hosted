import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { authClient } from "../../config/auth-client";
import { toast } from "sonner";

interface SignupProps {
  onNavigate?: (path: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!firstName || !email || !password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    authClient.signUp.email(
      {
        email,
        password,
        name: firstName + " " + lastName,
        // add callback URL
      },
      {
        onRequest: () => {
          setIsLoading(true);
          setError("");
        },
        onSuccess: () => {
          setIsLoading(false);
          setShowVerificationMessage(true);
        },
        onError: (ctx) => {
          setError(ctx.error.message || "An error occurred during sign up");
          setIsLoading(false);
        },
      }
    );

    // Remove the setTimeout mock logic since we're using the actual auth client
  };

  const handleResendVerification = () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    authClient
      .sendVerificationEmail({ email })
      .then(() => {
        toast.success("Verification email sent again!");
      })
      .catch((err) => {
        console.error("Failed to resend verification email:", err);
        toast.error("Failed to resend verification email. Please try again.");
      });
    toast.success("Verification email sent again!");
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex items-center space-x-2 justify-center mb-6">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <link rel="icon" type="image/svg+xml" href={`${import.meta.env.VITE_BASENAME}/logo.svg`} />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Scriptopia
              </span>
            </div>

            <div className="mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-4">
                We sent a verification link to
              </p>
              <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2 mb-6">
                {email}
              </p>
              <p className="text-sm text-gray-600">
                Click the link in the email to verify your account. If you don't
                see it, check your spam folder.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Resend verification email
              </button>

              <button
                onClick={() => onNavigate?.("/sign-in")}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Wrong email address?{" "}
                <button
                  onClick={() => setShowVerificationMessage(false)}
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Go back and try again
                </button>
              </p>
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
                <link rel="icon" type="image/svg+xml" href={`${import.meta.env.VITE_BASENAME}/logo.svg`} />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Scriptopia
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">to continue to Scriptopia</p>
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name{" "}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
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
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
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
                    Creating account...
                  </div>
                ) : (
                  "CONTINUE"
                )}
              </button>
            </form>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Have an account?{" "}
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

export default Signup;
