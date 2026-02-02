"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if inside form, though it's outside
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // Check if session was created immediately (meaning email confirmation might be disabled or auto-confirmed)
      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        setMessage("Check your email for the confirmation link.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-8"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-center text-sm text-blue-400">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500 focus:bg-white/10"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500 focus:bg-white/10"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-white/40">
            Don&apos;t have an account?{" "}
          </span>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
}
