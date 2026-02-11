"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleAdminLogin } from "@/lib/actions/auth-action";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email.toLowerCase().includes("-admin-")) {
        throw new Error("Admin login email must include '-admin-'.");
      }

      const response = await handleAdminLogin({ email, password });
      if (!response.success) {
        throw new Error(response.message);
      }
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-[#d8e5f8] bg-white p-6 shadow-[0_14px_30px_rgba(74,144,226,0.18)]">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Admin Access</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1a2b44]">Sign in as Admin</h1>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <label className="block text-sm font-semibold text-[#1a2b44]">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm outline-none focus:ring-2 focus:ring-[#4A90E2]/30"
          />
        </label>
        <label className="block text-sm font-semibold text-[#1a2b44]">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-1 h-11 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm outline-none focus:ring-2 focus:ring-[#4A90E2]/30"
          />
        </label>

        {error ? <p className="text-sm text-[#b91c1c]">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-[#4A90E2] text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD] disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Admin Login"}
        </button>
      </form>

      <p className="mt-4 text-xs text-[#5f7590]">
        Not an admin?{" "}
        <Link href="/login" className="font-semibold text-[#4A90E2]">
          Go to user login
        </Link>
      </p>
    </div>
  );
}
