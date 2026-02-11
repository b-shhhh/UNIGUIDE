import Link from "next/link";
import UniversityTable from "./[id]/_components/UniversityTable";

const sampleUniversities = [
  { id: "u1", name: "University of Toronto", country: "Canada", courses: "CS, Data Science" },
  { id: "u2", name: "TU Munich", country: "Germany", courses: "Informatics, AI" },
];

export default function UniversitiesPage() {
  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Universities</p>
          <h2 className="text-2xl font-bold text-[#1a2b44]">Manage Universities</h2>
        </div>
        <Link
          href="/admin/universities/create"
          className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          Create University
        </Link>
      </div>
      <UniversityTable rows={sampleUniversities} />
    </div>
  );
}

