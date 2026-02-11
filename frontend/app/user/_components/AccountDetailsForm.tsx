import Link from "next/link";

export default function AccountDetailsForm() {
  return (
    <section className="rounded-[8px] border border-[#d8e5f8] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-bold text-[#333333]">Account Details</h2>
      <p className="mt-2 text-sm text-[#666666]">
        View and manage your account information from the centralized profile dashboard.
      </p>
      <Link
        href="/user/profile"
        className="mt-4 inline-flex rounded-[8px] border border-[#4A90E2]/30 px-4 py-2 text-sm font-semibold text-[#4A90E2] hover:bg-[#eef5ff]"
      >
        Open Account Details
      </Link>
    </section>
  );
}
