import Link from "next/link";
import { getCourses } from "@/lib/csv-universities";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Browse</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1a2b44]">All Courses</h2>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/homepage/courses/${course.slug}`}
            className="rounded-xl border border-[#d8e5f8] bg-white p-4 hover:bg-[#f5f9ff]"
          >
            <p className="text-base font-bold text-[#1a2b44]">{course.name}</p>
            <p className="mt-1 text-xs text-[#5f7590]">{course.count} universities</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

