"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/universities", label: "Universities" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/countries", label: "Countries" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
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
  );
}
