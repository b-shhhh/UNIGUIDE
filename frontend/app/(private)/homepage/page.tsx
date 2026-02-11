import { fetchHomepageData } from "@/lib/api/recommendation";
import HomeDashboardClient from "../_component/HomeDashboardClient";

export default async function Homepage() {
  const { stats, universities, deadlines } = await fetchHomepageData();

  return <HomeDashboardClient stats={stats} universities={universities} deadlines={deadlines} />;
}
