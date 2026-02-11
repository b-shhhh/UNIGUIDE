"use client";

import { useState } from "react";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action"; // <-- import your server-side password reset handler
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await handleRequestPasswordReset(email);
      if (!res.success) throw new Error(res.message || "Failed to send reset email");
      setSuccess(res.message || "Password reset email sent successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md bg-white p-10 rounded-3xl shadow-xl space-y-5">
      <h2 className="text-center text-2xl font-bold text-gray-800">Forgot Password</h2>
      <p className="text-center text-gray-500 text-sm">
        Enter your email to reset your password
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Email
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {error && <p className="text-red-500 text-[9px]">{error}</p>}
        {success && <p className="text-green-500 text-[9px]">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-[0.1em] hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center mt-3 text-[10px] text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-purple-700 hover:underline uppercase">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
