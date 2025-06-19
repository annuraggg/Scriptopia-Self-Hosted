import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "../../config/auth-client";

interface SigninProps {
  onNavigate?: (path: string) => void;
}

const Signin: React.FC<SigninProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (error) {
      setError(error.message || "An error occurred during sign in");
      setIsLoading(false);
      return;
    }

    if (data) {
      setIsLoading(false);
      if (onNavigate) {
        onNavigate("/dashboard");
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6 sm:px-6 lg:px-8">
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
                Scriptopia
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
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
                  placeholder=""
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
                    Signing in...
                  </div>
                ) : (
                  "CONTINUE"
                )}
              </button>
            </form>

            <div className="text-center space-y-2">
              <div>
                <button
                  onClick={() => onNavigate?.("/forgot-password")}
                  className="text-sm font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </button>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  No account?{" "}
                  <button
                    onClick={() => onNavigate?.("/sign-up")}
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Sign up
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
