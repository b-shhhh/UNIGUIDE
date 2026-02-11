import Link from "next/link";

const links = [
  { href: "/admin", label: "Users" },
  { href: "/admin/users/create", label: "Create" }
];

export default function Sidebar() {
  return (
    <aside className="w-full rounded-[8px] border border-[#d8e5f8] bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.08)] lg:w-64 lg:shrink-0">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#666666]">Navigation</p>
      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-[8px] border border-[#d8e5f8] px-3 py-2 text-sm font-semibold text-[#4A90E2] hover:bg-[#eef5ff]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
