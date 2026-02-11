"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon } from "@heroicons/react/24/outline";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInputId = "login-email";
  const passwordInputId = "login-password";
  const errorMessageId = "login-error";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await handleLogin({ email, password });
      if (!response.success) throw new Error(response.message);

      setUser(response.data);
      router.push("/private/homepage");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8d5e7] px-4 py-10">
      <div className="w-full max-w-[340px] overflow-hidden rounded-2xl bg-[#f5f4f8] shadow-[0_24px_45px_rgba(78,68,132,0.25)]">
        <div className="bg-gradient-to-r from-[#5043d1] to-[#6a5af5] px-6 py-5 text-white">
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-4 w-4" />
            <div>
              <p className="text-sm font-semibold leading-none">UniGuide</p>
              <p className="text-[9px] text-white/80">Your success on your own platform</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 pb-6 pt-5">
          <h2 className="text-center text-[40px] font-black leading-none text-black">Log In</h2>

          <div className="space-y-3">
            <label htmlFor={emailInputId} className="sr-only">
              Email address
            </label>
            <input
              id={emailInputId}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="h-11 w-full rounded-xl border border-[#d3d3de] bg-[#f1f1f6] px-3 text-sm text-[#4b4b5d] placeholder:text-[#9b9bac] outline-none focus:ring-2 focus:ring-[#6a5af5]/35"
            />

            <div className="relative">
              <label htmlFor={passwordInputId} className="sr-only">
                Password
              </label>
              <input
                id={passwordInputId}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="h-11 w-full rounded-xl border border-[#d3d3de] bg-[#f1f1f6] px-3 pr-10 text-sm text-[#4b4b5d] placeholder:text-[#9b9bac] outline-none focus:ring-2 focus:ring-[#6a5af5]/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#83839c] hover:text-[#59597a]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {error && (
            <p id={errorMessageId} role="alert" aria-live="assertive" className="text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-gradient-to-r from-[#5043d1] to-[#6a5af5] text-sm font-semibold text-white shadow-[0_8px_14px_rgba(90,78,217,0.35)] transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
