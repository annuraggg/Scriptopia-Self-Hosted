import { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/config/auth-client";
import { toast } from "sonner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const determineRedirect = (user: any) => {
    const platformParam = new URLSearchParams(window.location.search).get("platform");
    if (platformParam === "candidates") return import.meta.env.VITE_CANDIDATE_APP as string;
    if (platformParam === "campus") return import.meta.env.VITE_CAMPUS_APP as string;
    const md = user?.publicMetadata || {};
    if (md?.candidateId || md?.role === "candidate") return import.meta.env.VITE_CANDIDATE_APP as string;
    return import.meta.env.VITE_CAMPUS_APP as string;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authClient.signUp.email({ email, password, name: name || email.split('@')[0] });
      if (res.error) {
        toast.error(res.error.message || "Failed to sign up");
      } else {
        toast.success("Account created. Please verify your email.");
        const target = determineRedirect(res.data?.user);
        window.location.href = target + "/dashboard";
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded-lg px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded-lg px-3 py-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border rounded-lg px-3 py-2" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 disabled:opacity-50">{loading ? "Creating..." : "Create account"}</button>
        <div className="text-center text-sm">Already have an account? <a href="/sign-in" className="text-purple-600 hover:underline">Sign in</a></div>
      </motion.form>
    </div>
  );
}
