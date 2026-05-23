import React, { useState } from "react";
import { Lock, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface LoginViewProps {
  onLoginSuccess: (token: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("shorts_admin_token", data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || "Incorrect admin password.");
      }
    } catch (err) {
      setError("Server offline. Please ensure the dev server is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative px-4">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl mb-0 select-none pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl bg-[#0A0A0A] border border-purple-900/30 relative z-10 shadow-[0_0_20px_rgba(168,85,247,0.05)]"
        id="login-card"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white m-0 uppercase">
            AI Shorts <span className="text-purple-400">Factory</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1.5 font-mono uppercase tracking-wider">
            Personal Content Suite - Admin Only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full bg-[#111111] border border-white/5 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition duration-200 text-sm font-sans"
              />
              <Lock className="w-4 h-4 text-purple-400/60 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Unlock Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-400/40" />
          <span className="text-[10px] text-purple-400/40 font-mono tracking-wider uppercase">
            Passphrase secures localized database file
          </span>
        </div>
      </motion.div>
    </div>
  );
}
