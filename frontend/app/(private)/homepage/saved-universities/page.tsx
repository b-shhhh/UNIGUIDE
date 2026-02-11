import SavedUniversitiesClient from "../../_component/SavedUniversitiesClient";
import { fetchHomepageData } from "@/lib/api/recommendation";

export default async function SavedUniversitiesPage() {
  const { universities } = await fetchHomepageData();
  return <SavedUniversitiesClient universities={universities} />;
}

