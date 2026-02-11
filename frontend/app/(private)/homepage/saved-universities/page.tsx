import CsvSavedUniversitiesClient from "../../_component/CsvSavedUniversitiesClient";
import { getUniversities } from "@/lib/csv-universities";

export default async function SavedUniversitiesPage() {
  const universities = await getUniversities();
  return <CsvSavedUniversitiesClient universities={universities} />;
}
