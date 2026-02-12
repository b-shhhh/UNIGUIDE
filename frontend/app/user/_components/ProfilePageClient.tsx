"use client";

import Link from "next/link";
import { useActionState, useMemo } from "react";
import { handleChangePassword, handleDeleteAccount, handleLogout, handleUpdateProfile } from "@/lib/actions/auth-action";

type UserRecord = Record<string, unknown> | null;

type ActionFeedback = {
  success: boolean;
  message: string;
};

const INITIAL_FEEDBACK: ActionFeedback = {
  success: false,
  message: "",
};

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return fallback;
};

const getUserDisplayName = (user: UserRecord) => {
  const explicitName = asString(user?.fullName) || asString(user?.name) || asString(user?.username);
  if (explicitName) return explicitName;
  return "User";
};

const getUserEmail = (user: UserRecord) => asString(user?.email);
const getUserPhone = (user: UserRecord) => asString(user?.phone);
const getUserBio = (user: UserRecord) => asString(user?.bio);
const getAvatar = (user: UserRecord) =>
  asString(user?.profilePic) ||
  asString(user?.avatar) ||
  asString(user?.profileImage) ||
  asString(user?.profilePicture) ||
  asString(user?.image);

const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (/^https?:\/\//i.test(avatar)) return avatar;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5050";
  const normalized = avatar.replace(/\\/g, "/");
  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
  const resolvedPath = uploadsIndex >= 0 ? normalized.slice(uploadsIndex) : normalized;
  const path = resolvedPath.startsWith("/") ? resolvedPath : `/${resolvedPath}`;
  return `${baseUrl}${path}`;
};

const updateProfileAction = async (_prev: ActionFeedback, formData: FormData): Promise<ActionFeedback> => {
  const result = await handleUpdateProfile(formData);
  return {
    success: result.success,
    message: result.message,
  };
};

const changePasswordAction = async (_prev: ActionFeedback, formData: FormData): Promise<ActionFeedback> => {
  const currentPassword = asString(formData.get("currentPassword"));
  const newPassword = asString(formData.get("newPassword"));
  const confirmPassword = asString(formData.get("confirmPassword"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All password fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New password and confirm password do not match." };
  }

  const result = await handleChangePassword({
    currentPassword,
    newPassword,
  });

  return {
    success: result.success,
    message: result.message,
  };
};

const deleteAccountAction = async (): Promise<ActionFeedback> => {
  const result = await handleDeleteAccount({});
  return {
    success: result.success,
    message: result.message,
  };
};

export default function ProfilePageClient({ user }: { user: UserRecord }) {
  const [profileState, profileFormAction, profilePending] = useActionState(updateProfileAction, INITIAL_FEEDBACK);
  const [passwordState, passwordFormAction, passwordPending] = useActionState(changePasswordAction, INITIAL_FEEDBACK);
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteAccountAction, INITIAL_FEEDBACK);

  const displayName = useMemo(() => getUserDisplayName(user), [user]);
  const email = useMemo(() => getUserEmail(user), [user]);
  const phone = useMemo(() => getUserPhone(user), [user]);
  const bio = useMemo(() => getUserBio(user), [user]);
  const avatar = useMemo(() => getAvatar(user), [user]);
  const avatarUrl = useMemo(() => getAvatarUrl(avatar), [avatar]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_14px_36px_rgba(3,105,161,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">Profile Settings</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Manage your account</h1>
          <p className="mt-3 max-w-3xl text-sm text-sky-100">
            Update your details, upload profile photo, change password, and manage account actions from one dashboard.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Current Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-sky-200 bg-sky-50">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile image" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">No Photo</div>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{displayName}</p>
              <p className="text-sm text-slate-600">{email || "No email available"}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>Phone: {phone || "Not set"}</p>
          </div>
          {bio ? <p className="mt-4 rounded-xl border border-sky-100 bg-sky-50/40 p-3 text-sm text-slate-700">{bio}</p> : null}
        </article>

        <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Edit Info & Upload Picture</h2>
            <Link href="/homepage" className="text-xs font-bold uppercase tracking-[0.08em] text-sky-700 hover:text-sky-900">
              Back to dashboard
            </Link>
          </div>
          <form action={profileFormAction} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Full Name
              <input
                name="fullName"
                defaultValue={displayName === "User" ? "" : displayName}
                className="mt-1 h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Email
              <input
                name="email"
                type="email"
                defaultValue={email}
                className="mt-1 h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Phone
              <input
                name="phone"
                defaultValue={phone}
                className="mt-1 h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Bio
              <textarea
                name="bio"
                defaultValue={bio}
                rows={3}
                className="mt-1 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Upload Profile Picture
              <input
                name="profileImage"
                type="file"
                accept="image/*"
                className="mt-1 block h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-sky-800"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={profilePending}
                className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800 disabled:opacity-50"
              >
                {profilePending ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
          {profileState.message ? (
            <p className={`mt-3 text-sm font-medium ${profileState.success ? "text-teal-700" : "text-rose-700"}`}>{profileState.message}</p>
          ) : null}
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Change Password</h2>
          <form action={passwordFormAction} className="mt-3 space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Current Password
              <input
                name="currentPassword"
                type="password"
                className="mt-1 h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              New Password
              <input
                name="newPassword"
                type="password"
                className="mt-1 h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Confirm Password
              <input
                name="confirmPassword"
                type="password"
                className="mt-1 h-11 w-full rounded-xl border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </label>
            <button
              type="submit"
              disabled={passwordPending}
              className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800 disabled:opacity-50"
            >
              {passwordPending ? "Updating..." : "Change password"}
            </button>
          </form>
          {passwordState.message ? (
            <p className={`mt-3 text-sm font-medium ${passwordState.success ? "text-teal-700" : "text-rose-700"}`}>{passwordState.message}</p>
          ) : null}
        </article>

        <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Account Actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={handleLogout}>
              <button type="submit" className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800">
                Logout
              </button>
            </form>
          </div>
          <form
            action={deleteFormAction}
            className="mt-4"
            onSubmit={(event) => {
              const ok = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
              if (!ok) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rose-800 disabled:opacity-50"
            >
              {deletePending ? "Deleting..." : "Delete Account"}
            </button>
          </form>
          {deleteState.message ? (
            <p className={`mt-3 text-sm font-medium ${deleteState.success ? "text-teal-700" : "text-rose-700"}`}>{deleteState.message}</p>
          ) : null}
        </article>
      </section>
    </div>
  );
}
