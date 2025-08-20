import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/config/auth-client";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid or missing token");
    if (!password || password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setSubmitting(true);
    try {
      const res = await authClient.resetPassword({ token, newPassword: password });
      if (res.error) {
        toast.error(res.error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully");
        const platform = new URLSearchParams(window.location.search).get("platform");
        const target =
          platform === "candidates"
            ? (import.meta.env.VITE_CANDIDATE_APP as string)
            : (import.meta.env.VITE_CAMPUS_APP as string);
        window.location.href = target + "/dashboard";
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Reset your password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !token}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 disabled:opacity-50"
          >
            {submitting ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}