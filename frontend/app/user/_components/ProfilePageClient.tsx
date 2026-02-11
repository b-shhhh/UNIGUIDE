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

  const firstName = asString(user?.firstName);
  const lastName = asString(user?.lastName);
  const combined = `${firstName} ${lastName}`.trim();
  return combined || "User";
};

const getUserEmail = (user: UserRecord) => asString(user?.email);
const getUserPhone = (user: UserRecord) => asString(user?.phone);
const getUserFirstName = (user: UserRecord) => asString(user?.firstName);
const getUserLastName = (user: UserRecord) => asString(user?.lastName);
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
  // Handle old stored absolute filesystem paths by extracting `/uploads/...`.
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

const deleteAccountAction = async (_prev: ActionFeedback, formData: FormData): Promise<ActionFeedback> => {
  const confirmText = asString(formData.get("confirmText"));
  const password = asString(formData.get("password"));

  if (confirmText !== "DELETE") {
    return {
      success: false,
      message: 'Type "DELETE" exactly to confirm account deletion.',
    };
  }

  const result = await handleDeleteAccount({
    password,
    confirmText,
  });

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
  const firstName = useMemo(() => getUserFirstName(user), [user]);
  const lastName = useMemo(() => getUserLastName(user), [user]);
  const bio = useMemo(() => getUserBio(user), [user]);
  const avatar = useMemo(() => getAvatar(user), [user]);
  const avatarUrl = useMemo(() => getAvatarUrl(avatar), [avatar]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="rounded-[8px] border border-[#4A90E2]/20 bg-[linear-gradient(120deg,#4A90E2_0%,#357ABD_100%)] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#e9f2ff]">Profile Settings</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-4xl">Manage your account</h1>
        <p className="mt-3 text-sm text-[#eaf2ff]">Upload profile photo, update your details, change password, logout, or delete your account.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[8px] border border-[#d8e5f8] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
          <h2 className="text-lg font-bold text-[#333333]">Current Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-[#1a2b44]/10 bg-[#eef4ff]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile image" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#666666]">No Photo</div>
              )}
            </div>
            <div>
              <p className="font-semibold text-[#333333]">{displayName}</p>
              <p className="text-sm text-[#666666]">{email || "No email available"}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-[#666666]">
            <p>Phone: {phone || "Not set"}</p>
          </div>
          {bio ? <p className="mt-4 text-sm text-[#666666]">{bio}</p> : null}
        </article>

        <article className="rounded-[8px] border border-[#d8e5f8] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)] lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#333333]">Edit Info & Upload Picture</h2>
            <Link href="/homepage" className="text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2] hover:text-[#F5A623]">
              Back to dashboard
            </Link>
          </div>
          <form action={profileFormAction} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#1a2b44]">
              First Name
              <input
                name="firstName"
                defaultValue={firstName}
                className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm font-semibold text-[#1a2b44]">
              Last Name
              <input name="lastName" defaultValue={lastName} className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-semibold text-[#1a2b44]">
              Email
              <input name="email" type="email" defaultValue={email} className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-semibold text-[#1a2b44]">
              Phone
              <input name="phone" defaultValue={phone} className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-semibold text-[#1a2b44] sm:col-span-2">
              Bio
              <textarea name="bio" defaultValue={bio} rows={3} className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-semibold text-[#1a2b44] sm:col-span-2">
              Upload Profile Picture
              <input
                name="profileImage"
                type="file"
                accept="image/*"
                className="mt-1 block w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={profilePending}
                className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD] disabled:opacity-50"
              >
                {profilePending ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
          {profileState.message ? (
            <p className={`mt-3 text-sm ${profileState.success ? "text-[#0f766e]" : "text-[#b91c1c]"}`}>{profileState.message}</p>
          ) : null}
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[8px] border border-[#d8e5f8] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
          <h2 className="text-lg font-bold text-[#333333]">Change Password</h2>
          <form action={passwordFormAction} className="mt-3 space-y-3">
            <label className="block text-sm font-semibold text-[#1a2b44]">
              Current Password
              <input name="currentPassword" type="password" className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm font-semibold text-[#1a2b44]">
              New Password
              <input name="newPassword" type="password" className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm font-semibold text-[#1a2b44]">
              Confirm Password
              <input name="confirmPassword" type="password" className="mt-1 w-full rounded-lg border border-[#1a2b44]/20 px-3 py-2 text-sm" />
            </label>
            <button
              type="submit"
              disabled={passwordPending}
              className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD] disabled:opacity-50"
            >
              {passwordPending ? "Updating..." : "Change password"}
            </button>
          </form>
          {passwordState.message ? (
            <p className={`mt-3 text-sm ${passwordState.success ? "text-[#0f766e]" : "text-[#b91c1c]"}`}>{passwordState.message}</p>
          ) : null}
        </article>

        <article className="rounded-[8px] border border-[#f7c99b]/40 bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
          <h2 className="text-lg font-bold text-[#333333]">Account Actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={handleLogout}>
              <button type="submit" className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD]">
                Logout
              </button>
            </form>
          </div>

          <form action={deleteFormAction} className="mt-4 space-y-3">
            <p className="text-sm text-[#4f6682]">Delete account is permanent. Type DELETE to confirm.</p>
            <label className="block text-sm font-semibold text-[#1a2b44]">
              Confirm Text
              <input
                name="confirmText"
                placeholder="DELETE"
                className="mt-1 w-full rounded-lg border border-[#dc2626]/30 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-semibold text-[#1a2b44]">
              Password (if required by backend)
              <input name="password" type="password" className="mt-1 w-full rounded-lg border border-[#dc2626]/30 px-3 py-2 text-sm" />
            </label>
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-lg bg-[#b91c1c] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white disabled:opacity-50"
            >
              {deletePending ? "Deleting..." : "Delete account"}
            </button>
          </form>
          {deleteState.message ? (
            <p className={`mt-3 text-sm ${deleteState.success ? "text-[#0f766e]" : "text-[#b91c1c]"}`}>{deleteState.message}</p>
          ) : null}
        </article>
      </section>
    </div>
  );
}
