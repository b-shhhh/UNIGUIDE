"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleRegister } from "@/lib/actions/auth-action";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const [pending] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      countryCode: "+977",
      password: data.password,
    };

    try {
      const res = await handleRegister(payload);
      if (!res.success) throw new Error(res.message || "Registration failed");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-[0_14px_34px_rgba(3,105,161,0.16)] sm:p-8">
      <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-800">
        New Account
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Create account</h2>
      <p className="mt-2 text-sm text-slate-600">Sign up to build your university shortlist.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Full Name</label>
          <input
            type="text"
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
            className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
          {errors.name && <p className="text-xs text-rose-700">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Email</label>
          <input
            type="email"
            placeholder="name@gmail.com"
            {...register("email", { required: "Email is required" })}
            className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
          {errors.email && <p className="text-xs text-rose-700">{errors.email.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 my-1 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-sky-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-700">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", { required: "Confirm your password" })}
                className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 pr-20 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-2 my-1 rounded-lg px-3 text-xs font-semibold text-slate-600 hover:bg-sky-100"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-700">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">Phone Number (NP +977)</label>
          <div className="flex gap-2">
            <div className="flex h-12 items-center rounded-xl border border-sky-100 bg-sky-50/60 px-3 text-xs font-semibold text-slate-700">
              NP&nbsp;+977
            </div>
            <input
              type="tel"
              placeholder="9800000000"
              {...register("phone", { required: "Phone number is required" })}
              className="h-12 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </div>
          {errors.phone && <p className="text-xs text-rose-700">{errors.phone.message}</p>}
        </div>

        {error && <p className="text-xs text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="mt-2 h-12 w-full rounded-xl bg-sky-700 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || pending ? "Registering..." : "Register"}
        </button>

        <div className="mt-1 text-center text-xs text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold uppercase tracking-wide text-sky-700 hover:text-sky-900">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
