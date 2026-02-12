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

      // Set user in context
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
    <div className="rounded-[16px] border border-[#dbe8fb] bg-white p-8 shadow-[0_14px_34px_rgba(74,144,226,0.18)]">
      <h2 className="text-center text-3xl font-bold text-[#333333]">Welcome Back</h2>
      <p className="mt-2 text-center text-sm text-[#666666]">Sign in to continue your university search</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Email Address</label>
            <input
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 w-full rounded-[8px] bg-[#4A90E2] text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#357ABD] disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="mt-1 text-center text-xs text-[#666666]">
            <Link href="/forget-password" className="font-semibold uppercase text-[#4A90E2] hover:text-[#F5A623]">
              Forgot password?
            </Link>
          </div>

          <div className="mt-1 text-center text-xs text-[#666666]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold uppercase text-[#4A90E2] hover:text-[#F5A623]">
              Sign up
            </Link>
          </div>
        </form>
    </div>
  );
}
