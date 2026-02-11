"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/users/create", label: "Create User" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-xl border border-[#d8e5f8] bg-white p-3">
      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
                active ? "bg-[#4A90E2] text-white" : "text-[#1a2b44] hover:bg-[#f5f9ff]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
