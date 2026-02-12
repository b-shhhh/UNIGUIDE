import CsvDashboardClient from "../_component/CsvDashboardClient";
import { buildCountries, buildCourses, getUniversities } from "@/lib/csv-universities";

export default async function Homepage() {
  const universities = await getUniversities();
  const countries = buildCountries(universities);
  const courses = buildCourses(universities);
  return <CsvDashboardClient universities={universities} countries={countries} courses={courses} />;
}
