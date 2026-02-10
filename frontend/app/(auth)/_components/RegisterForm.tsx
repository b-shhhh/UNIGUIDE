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
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    defaultValues: { name: "", email: "", countryCode: "+977", phone: "", password: "", confirmPassword: "" },
  });

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterFormData) => {
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      username: data.name,
      email: data.email,
      phone: data.phone,
      countryCode: data.countryCode,
      password: data.password,
    };

    try {
      const res = await handleRegister(payload);
      if (!res.success) throw new Error(res.message || "Registration failed");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 via-purple-500 to-indigo-500 relative overflow-hidden">
      {/* Header Curve */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-700 to-indigo-600 rounded-b-[50%] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {/* Graduation Cap Icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0 0l-3-3m3 3l3-3" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">UniGuide</h1>
        </div>
      </div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md bg-white p-10 rounded-3xl shadow-xl space-y-5">
        <h2 className="text-center text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 text-sm">Sign up to find your perfect university</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
            <input type="text" placeholder="Your Name" {...register("name", { required: "Name is required" })} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500" />
            {errors.name && <p className="text-[9px] text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
            <input type="email" placeholder="example@gmail.com" {...register("email", { required: "Email is required" })} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500" />
            {errors.email && <p className="text-[9px] text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input type="password" placeholder="********" {...register("password", { required: "Password is required" })} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500" />
            {errors.password && <p className="text-[9px] text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
            <input type="password" placeholder="********" {...register("confirmPassword", { required: "Confirm your password" })} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500" />
            {errors.confirmPassword && <p className="text-[9px] text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
            <div className="flex gap-1">
              <select {...register("countryCode")} className="h-10 px-2 border border-slate-200 rounded-l-lg text-[11px] text-slate-600 outline-none">
                <option value="+977">🇳🇵 +977</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+86">🇨🇳 +86</option>
              </select>
              <input type="tel" placeholder="9800000000" {...register("phone", { required: "Phone number is required" })} className="w-full h-10 px-3 border-t border-b border-r border-slate-200 rounded-r-lg text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            {errors.phone && <p className="text-[9px] text-red-500">{errors.phone.message}</p>}
          </div>

          {/* General Error */}
          {error && <p className="text-red-500 text-[9px]">{error}</p>}

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting || pending} className="w-full h-10 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-[10px] uppercase tracking-[0.1em] hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50">
            {isSubmitting || pending ? "Registering..." : "Register"}
          </button>

          <div className="text-center mt-3 text-[10px] text-slate-400">
            Already have an account? <Link href="/login" className="font-bold text-purple-700 hover:underline uppercase">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
