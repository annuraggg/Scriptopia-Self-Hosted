import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  onNavigate?: (path: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate("/sign-in");
    } else {
      window.location.href = "/sign-in";
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 justify-center mb-8">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Scriptopia
            </span>
          </div>

          {/* 404 Content */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Sign In
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Check out our{" "}
              <a
                href="/support"
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                support page
              </a>{" "}
              or{" "}
              <a
                href="/documentation"
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                documentation
              </a>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;