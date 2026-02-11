"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createAdminUser } from "@/lib/api/admin/user";
import { adminCreateUserSchema, type AdminCreateUserForm } from "../schema";

export default function CreateUserForm() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminCreateUserForm>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: ""
    }
  });

  const onSubmit = async (values: AdminCreateUserForm) => {
    setSubmitting(true);
    setServerMessage("");

    try {
      const response = await createAdminUser(values);
      if (response.success) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setServerMessage(response.message || "Failed to create user");
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Create User</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">First Name</span>
          <input {...register("firstName")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          {errors.firstName ? <p className="text-xs text-red-600">{errors.firstName.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-semibold text-slate-700">Last Name</span>
          <input {...register("lastName")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          {errors.lastName ? <p className="text-xs text-red-600">{errors.lastName.message}</p> : null}
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-slate-700">Email</span>
        <input {...register("email")} type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-slate-700">Phone</span>
        <input {...register("phone")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-slate-700">Password</span>
        <input
          {...register("password")}
          type="password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
      </label>

      {serverMessage ? <p className="text-sm text-red-600">{serverMessage}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
