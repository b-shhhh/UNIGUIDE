"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { handleLogin } from "@/lib/actions/auth-action";

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

      setUser(response.data);
      const role =
        response.data && typeof response.data === "object" && "role" in response.data
          ? (response.data as { role?: unknown }).role
          : undefined;
      router.push(role === "admin" ? "/admin" : "/homepage");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-[0_14px_34px_rgba(3,105,161,0.16)] sm:p-8">
      <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-800">
        Account Access
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
      <p className="mt-2 text-sm text-slate-600">Sign in to continue your university search.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Email Address</label>
          <input
            type="email"
            placeholder="name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        {error && <p className="text-xs font-semibold text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full rounded-xl bg-sky-700 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-1 text-center text-xs text-slate-600">
          <Link href="/forget-password" className="font-semibold uppercase tracking-wide text-sky-700 hover:text-sky-900">
            Forgot password?
          </Link>
        </div>

        <div className="mt-1 text-center text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold uppercase tracking-wide text-sky-700 hover:text-sky-900">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
