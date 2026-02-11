"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminCrudSection from "./AdminCrudSection";
import {
  adminLogout,
  adminProfile,
  createAdminCountry,
  createAdminCourse,
  createAdminUniversity,
  createAdminUser,
  deleteAdminCountry,
  deleteAdminCourse,
  deleteAdminUniversity,
  deleteAdminUser,
  listAdminCountries,
  listAdminCourses,
  listAdminUniversities,
  listAdminUsers,
  updateAdminCountry,
  updateAdminCourse,
  updateAdminUniversity,
  updateAdminUser,
} from "@/lib/api/admin";

type Item = Record<string, unknown>;

const toOutcome = (result: { success: boolean; message?: string }) => ({
  success: result.success,
  message: result.message || (result.success ? "Success" : "Operation failed"),
});

export default function AdminDashboardClient() {
  const [profile, setProfile] = useState<Item | null>(null);
  const [users, setUsers] = useState<Item[]>([]);
  const [universities, setUniversities] = useState<Item[]>([]);
  const [courses, setCourses] = useState<Item[]>([]);
  const [countries, setCountries] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [profileRes, usersRes, universitiesRes, coursesRes, countriesRes] = await Promise.all([
      adminProfile(),
      listAdminUsers(),
      listAdminUniversities(),
      listAdminCourses(),
      listAdminCountries(),
    ]);

    setProfile(profileRes.success ? (profileRes.data ?? null) : null);
    setUsers(usersRes.success && Array.isArray(usersRes.data) ? usersRes.data : []);
    setUniversities(universitiesRes.success && Array.isArray(universitiesRes.data) ? universitiesRes.data : []);
    setCourses(coursesRes.success && Array.isArray(coursesRes.data) ? coursesRes.data : []);
    setCountries(countriesRes.success && Array.isArray(countriesRes.data) ? countriesRes.data : []);
    setLoading(false);
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const onLogout = async () => {
    await adminLogout();
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[#d8e5f8] bg-white p-5 text-sm text-[#5f7590]">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#d8e5f8] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Overview</p>
            <h2 className="text-2xl font-bold text-[#1a2b44]">Admin Dashboard</h2>
            <p className="text-sm text-[#5f7590]">
              {profile ? `Logged in as ${String(profile.fullName || profile.email || "Admin")}` : "Admin session"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/profile"
              className="rounded-lg border border-[#d8e5f8] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
            >
              Profile
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-[#1a2b44] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <AdminCrudSection
        title="Users"
        subtitle="CRUD"
        items={users}
        fields={[
          { key: "fullName", label: "Full Name", required: true },
          { key: "email", label: "Email", required: true },
          { key: "phone", label: "Phone", required: true },
          { key: "role", label: "Role", placeholder: "user/admin" },
          { key: "password", label: "Password", placeholder: "Required on create" },
        ]}
        onCreate={async (payload) => {
          const res = await createAdminUser(payload);
          await loadAll();
          return toOutcome(res);
        }}
        onUpdate={async (id, payload) => {
          const res = await updateAdminUser(id, payload);
          await loadAll();
          return toOutcome(res);
        }}
        onDelete={async (id) => {
          const res = await deleteAdminUser(id);
          await loadAll();
          return toOutcome(res);
        }}
      />

      <AdminCrudSection
        title="Universities"
        subtitle="CRUD"
        items={universities}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "country", label: "Country", required: true },
          { key: "courses", label: "Courses", placeholder: "comma,separated" },
          { key: "description", label: "Description" },
        ]}
        onCreate={async (payload) => {
          const res = await createAdminUniversity(payload);
          await loadAll();
          return toOutcome(res);
        }}
        onUpdate={async (id, payload) => {
          const res = await updateAdminUniversity(id, payload);
          await loadAll();
          return toOutcome(res);
        }}
        onDelete={async (id) => {
          const res = await deleteAdminUniversity(id);
          await loadAll();
          return toOutcome(res);
        }}
      />

      <AdminCrudSection
        title="Courses"
        subtitle="CRUD"
        items={courses}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "countries", label: "Countries", placeholder: "comma,separated" },
          { key: "description", label: "Description" },
        ]}
        onCreate={async (payload) => {
          const res = await createAdminCourse(payload);
          await loadAll();
          return toOutcome(res);
        }}
        onUpdate={async (id, payload) => {
          const res = await updateAdminCourse(id, payload);
          await loadAll();
          return toOutcome(res);
        }}
        onDelete={async (id) => {
          const res = await deleteAdminCourse(id);
          await loadAll();
          return toOutcome(res);
        }}
      />

      <AdminCrudSection
        title="Countries"
        subtitle="CRUD"
        items={countries}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "flagUrl", label: "Flag URL" },
        ]}
        onCreate={async (payload) => {
          const res = await createAdminCountry(payload);
          await loadAll();
          return toOutcome(res);
        }}
        onUpdate={async (id, payload) => {
          const res = await updateAdminCountry(id, payload);
          await loadAll();
          return toOutcome(res);
        }}
        onDelete={async (id) => {
          const res = await deleteAdminCountry(id);
          await loadAll();
          return toOutcome(res);
        }}
      />
    </div>
  );
}

