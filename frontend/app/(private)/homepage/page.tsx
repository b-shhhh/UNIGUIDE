import CsvDashboardClient from "../_component/CsvDashboardClient";
import { getCountries, getCourses, getUniversities } from "@/lib/csv-universities";

export default async function Homepage() {
  const [universities, countries, courses] = await Promise.all([
    getUniversities(),
    getCountries(),
    getCourses(),
  ]);
  return <CsvDashboardClient universities={universities} countries={countries} courses={courses} />;
}
