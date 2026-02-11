"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateAdminUser, deleteAdminUser, type AdminUser } from "@/lib/api/admin/user";
import { adminUpdateUserSchema, type AdminUpdateUserForm } from "../schema";

type Props = {
  user: AdminUser;
};

export default function UpdateUserForm({ user }: Props) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminUpdateUserForm>({
    resolver: zodResolver(adminUpdateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      password: ""
    }
  });

  const onSubmit = async (values: AdminUpdateUserForm) => {
    setSubmitting(true);
    setServerMessage("");

    try {
      const payload = values.password ? values : { ...values, password: undefined };
      const response = await updateAdminUser(user.id, payload as unknown as Record<string, unknown>);
      if (response.success) {
        router.push(`/admin/users/${user.id}`);
        router.refresh();
        return;
      }
      setServerMessage(response.message || "Failed to update user");
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    setSubmitting(true);
    setServerMessage("");

    try {
      const response = await deleteAdminUser(user.id);
      if (response.success) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setServerMessage(response.message || "Failed to delete user");
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-[8px] border border-[#d8e5f8] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      <h2 className="text-lg font-bold text-[#333333]">Update User</h2>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-[#666666]">Full Name</span>
        <input {...register("fullName")} className="w-full rounded-[8px] border border-[#c7d9f5] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4A90E2]/30" />
        {errors.fullName ? <p className="text-xs text-red-600">{errors.fullName.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-[#666666]">Email</span>
        <input {...register("email")} type="email" className="w-full rounded-[8px] border border-[#c7d9f5] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4A90E2]/30" />
        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-[#666666]">Phone</span>
        <input {...register("phone")} className="w-full rounded-[8px] border border-[#c7d9f5] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4A90E2]/30" />
        {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-semibold text-[#666666]">New Password (Optional)</span>
        <input
          {...register("password")}
          type="password"
          className="w-full rounded-[8px] border border-[#c7d9f5] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4A90E2]/30"
        />
      </label>

      {serverMessage ? <p className="text-sm text-red-600">{serverMessage}</p> : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-bold text-white hover:bg-[#357ABD] disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={submitting}
          className="rounded-[8px] bg-[#F5A623] px-4 py-2 text-sm font-bold text-[#333333] hover:bg-[#f8b84b] disabled:opacity-50"
        >
          Delete User
        </button>
      </div>
    </form>
  );
}
