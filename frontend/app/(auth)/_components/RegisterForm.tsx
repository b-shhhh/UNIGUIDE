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
  countryCode: string;
  phone: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: { name: "", email: "", countryCode: "+977", phone: "", password: "", confirmPassword: "" },
  });

  const [pending] = useTransition();
  const [error, setError] = useState("");

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
      countryCode: data.countryCode,
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
    <div className="rounded-[16px] border border-[#dbe8fb] bg-white p-8 shadow-[0_14px_34px_rgba(74,144,226,0.18)]">
      <h2 className="text-center text-3xl font-bold text-[#333333]">Create Account</h2>
      <p className="mt-2 text-center text-sm text-[#666666]">Sign up to find your perfect university</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Full Name</label>
          <input
            type="text"
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
            className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            {...register("email", { required: "Email is required" })}
            className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Password</label>
          <input
            type="password"
            placeholder="********"
            {...register("password", { required: "Password is required" })}
            className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
          />
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Confirm Password</label>
          <input
            type="password"
            placeholder="********"
            {...register("confirmPassword", { required: "Confirm your password" })}
            className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
          />
          {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666666]">Phone Number</label>
          <div className="flex gap-2">
            <select
              {...register("countryCode")}
              className="h-11 rounded-[8px] border border-[#c7d9f5] px-2 text-[12px] text-[#333333] outline-none"
            >
              <option value="+977">NP +977</option>
              <option value="+91">IN +91</option>
              <option value="+1">US +1</option>
              <option value="+44">UK +44</option>
              <option value="+86">CN +86</option>
            </select>
            <input
              type="tel"
              placeholder="9800000000"
              {...register("phone", { required: "Phone number is required" })}
              className="h-11 w-full rounded-[8px] border border-[#c7d9f5] px-3 text-sm text-[#333333] outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="mt-2 h-11 w-full rounded-[8px] bg-[#4A90E2] text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#357ABD] disabled:opacity-50"
        >
          {isSubmitting || pending ? "Registering..." : "Register"}
        </button>

        <div className="mt-1 text-center text-xs text-[#666666]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold uppercase text-[#4A90E2] hover:text-[#F5A623]">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
