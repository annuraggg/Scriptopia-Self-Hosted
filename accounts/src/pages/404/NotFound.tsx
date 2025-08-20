import { motion } from "framer-motion";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  onNavigate?: (path: string) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                scriptopia
              </span>
            </div>
            
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
              >
                <AlertCircle className="w-8 h-8 text-red-600" />
              </motion.div>
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Page not found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onNavigate?.("/sign-in")}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                <Home className="w-4 h-4" />
                <span>Go to Sign In</span>
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;