"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { handleResetPassword } from "@/lib/actions/auth-action";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Reset token is missing from the URL.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await handleResetPassword(token, newPassword);
      if (!res.success) {
        throw new Error(res.message || "Reset password failed");
      }

      setSuccess(res.message || "Password reset successful.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Reset password failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[16px] border border-[#dbe8fb] bg-white p-8 shadow-[0_14px_34px_rgba(74,144,226,0.18)]">
      <h2 className="text-center text-3xl font-bold text-[#333333]">Reset Password</h2>
      <p className="mt-2 text-center text-sm text-[#666666]">Set a new password for your account</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">
            New Password
          </label>
          <input
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full rounded-[8px] bg-[#4A90E2] text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#357ABD] disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="mt-1 text-center text-xs text-[#666666]">
          Back to{" "}
          <Link href="/login" className="font-semibold uppercase text-[#4A90E2] hover:text-[#F5A623]">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
