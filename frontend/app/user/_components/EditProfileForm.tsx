import Link from "next/link";

export default function EditProfileForm() {
  return (
    <section className="rounded-[8px] border border-[#d8e5f8] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-bold text-[#333333]">Edit Profile</h2>
      <p className="mt-2 text-sm text-[#666666]">
        Use the unified profile editor to update your personal details, bio, and photo.
      </p>
      <Link
        href="/user/profile"
        className="mt-4 inline-flex rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#357ABD]"
      >
        Go to Profile Editor
      </Link>
    </section>
  );
}
