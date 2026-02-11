import Link from "next/link";

const links = [
  { href: "/admin", label: "Users" },
  { href: "/admin/users/create", label: "Create" }
];

export default function Sidebar() {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 lg:w-64 lg:shrink-0">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Navigation</p>
      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
