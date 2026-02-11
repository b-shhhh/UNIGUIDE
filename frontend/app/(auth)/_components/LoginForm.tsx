"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import { handleLogin } from "@/lib/actions/auth-action"; // <-- import your server-side login handler

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await handleLogin({ email, password });
      if (!response.success) throw new Error(response.message);

      // Set user in context
      setUser(response.data);
      router.push("/homepage");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 via-purple-500 to-indigo-500 relative overflow-hidden">
      {/* Header Curve */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-700 to-indigo-600 rounded-b-[50%] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
            <AcademicCapIcon className="h-6 w-6 text-purple-700" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">UniGuide</h1>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white p-10 rounded-3xl shadow-xl space-y-5">
        <h2 className="text-center text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* General Error */}
          {error && <p className="text-red-500 text-[9px]">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-[0.1em] hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Footer Links */}
          <div className="text-center mt-3 text-[10px] text-slate-400">
            <Link href="/forget-password" className="font-bold text-purple-700 hover:underline uppercase">
              Forgot password?
            </Link>
          </div>

          <div className="text-center mt-3 text-[10px] text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-purple-700 hover:underline uppercase">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
