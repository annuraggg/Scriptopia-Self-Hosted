import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/config/auth-client";
import { toast } from "sonner";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const determineRedirect = (user: any) => {
    const platformParam = new URLSearchParams(window.location.search).get("platform");
    if (platformParam === "candidates") return import.meta.env.VITE_CANDIDATE_APP as string;
    if (platformParam === "campus") return import.meta.env.VITE_CAMPUS_APP as string;
    const md = user?.publicMetadata || {};
    if (md?.candidateId || md?.role === "candidate") return import.meta.env.VITE_CANDIDATE_APP as string;
    return import.meta.env.VITE_CAMPUS_APP as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        toast.error(res.error.message || "Invalid credentials");
      } else {
        const target = determineRedirect(res.data?.user);
        window.location.href = target + "/dashboard";
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authClient.getSession().then((session: any) => {
      if (session?.user) {
        const target = determineRedirect(session.user);
        window.location.href = target + "/dashboard";
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">scriptopia</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 mb-6">{isLoading ? "Signing in..." : "Continue"}</button>
          </form>
          <div className="text-center space-y-2">
            <div>
              <a href="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500">Forgot your password?</a>
            </div>
            <div className="text-sm text-gray-600">No account? <a href="/sign-up" className="font-medium text-purple-600 hover:text-purple-500">Sign up</a></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
