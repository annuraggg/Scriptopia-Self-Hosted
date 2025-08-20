import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  onNavigate?: (path: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate("/");
    } else {
      window.location.href = "/";
    }
  };

  const handleGoBack = () => {
    if (onNavigate) {
      onNavigate("/sign-in");
    } else {
      window.history.back();
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
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex items-center space-x-2 justify-center mb-8">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Scriptopia
            </span>
          </div>

          <div className="mb-8">
            <div className="text-6xl font-bold text-purple-600 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </button>

            <button
              onClick={handleGoBack}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;