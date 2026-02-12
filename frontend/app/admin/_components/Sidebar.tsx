"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/profile", label: "Profile", icon: "P" },
  { href: "/admin/users", label: "Users", icon: "U" },
  { href: "/admin/universities", label: "Universities", icon: "V" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-3xl border border-sky-200/80 bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-sky-700">Navigation</p>
      <nav className="space-y-2.5">
        {links.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-sky-700 to-cyan-700 text-white shadow-[0_8px_20px_rgba(3,105,161,0.25)]"
                  : "border border-sky-100 bg-sky-50/40 text-slate-700 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-[0_6px_16px_rgba(2,132,199,0.16)]"
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
