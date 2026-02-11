import axios from "./axios";
import { API } from "./endpoints";

type RawRecord = Record<string, unknown>;

export type HomepageStat = {
  label: string;
  value: string;
  tone: string;
};

export type UniversityRecommendation = {
  id: string;
  name: string;
  program: string;
  country: string;
  score: string;
  city: string;
  duration: string;
  tuition: string;
  ranking: string;
  intake: string;
  website: string;
  description: string;
};

export type DeadlineItem = {
  title: string;
  date: string;
  tone: DeadlineTone;
};

export type HomepagePayload = {
  stats: HomepageStat[];
  universities: UniversityRecommendation[];
  deadlines: DeadlineItem[];
};

const DEFAULT_STATS: HomepageStat[] = [
  { label: "Matches", value: "24", tone: "bg-[#d7f0ec] text-[#0f766e]" },
  { label: "Saved Universities", value: "8", tone: "bg-[#dbeafe] text-[#1d4ed8]" },
  { label: "Deadlines This Month", value: "3", tone: "bg-[#ffedd5] text-[#c2410c]" },
  { label: "Profile Completion", value: "82%", tone: "bg-[#ede9fe] text-[#6d28d9]" },
];

const DEFAULT_UNIVERSITIES: UniversityRecommendation[] = [
  {
    id: "unimelb-msc-data-science",
    name: "University of Melbourne",
    program: "MSc Data Science",
    country: "Australia",
    score: "96%",
    city: "Melbourne",
    duration: "2 years",
    tuition: "$39,000/year",
    ranking: "#14",
    intake: "July, February",
    website: "https://www.unimelb.edu.au",
    description: "Strong industry-linked data science program with practical capstone projects.",
  },
  {
    id: "tum-ms-informatics",
    name: "TU Munich",
    program: "MS Informatics",
    country: "Germany",
    score: "92%",
    city: "Munich",
    duration: "2 years",
    tuition: "Low / public fees",
    ranking: "#30",
    intake: "October",
    website: "https://www.tum.de",
    description: "Research-focused curriculum with access to Europe tech and engineering networks.",
  },
  {
    id: "utoronto-meng-software",
    name: "University of Toronto",
    program: "MEng Software",
    country: "Canada",
    score: "89%",
    city: "Toronto",
    duration: "1.5 years",
    tuition: "$52,000/year",
    ranking: "#21",
    intake: "September, January",
    website: "https://www.utoronto.ca",
    description: "Career-oriented engineering pathway with a strong software systems track.",
  },
  {
    id: "kcl-msc-ai",
    name: "King's College London",
    program: "MSc AI",
    country: "UK",
    score: "87%",
    city: "London",
    duration: "1 year",
    tuition: "£36,800/year",
    ranking: "#40",
    intake: "September",
    website: "https://www.kcl.ac.uk",
    description: "Intensive AI masters with core ML, NLP, and applied ethics modules.",
  },
];

type DeadlineTone = "bg-[#f3f8ff]" | "bg-[#fff7ed]" | "bg-[#eefcf7]";

const DEADLINE_TONES: readonly DeadlineTone[] = ["bg-[#f3f8ff]", "bg-[#fff7ed]", "bg-[#eefcf7]"];

const DEFAULT_DEADLINES: DeadlineItem[] = [
  { title: "TU Munich - Fall Intake", date: "March 20, 2026", tone: DEADLINE_TONES[0] },
  { title: "Toronto - Scholarship Form", date: "March 29, 2026", tone: DEADLINE_TONES[1] },
  { title: "Melbourne - SOP Upload", date: "April 3, 2026", tone: DEADLINE_TONES[2] },
];

const asArray = (value: unknown): RawRecord[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is RawRecord => typeof item === "object" && item !== null);
};

const getString = (record: RawRecord, keys: string[], fallback = ""): string => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
  }
  return fallback;
};

const normalizeScore = (value: string): string => {
  if (!value) {
    return "";
  }
  return value.endsWith("%") ? value : `${value}%`;
};

const normalizeStats = (rows: RawRecord[]): HomepageStat[] => {
  const normalized = rows
    .map((row, index) => {
      const label = getString(row, ["label", "name", "title"]);
      const value = getString(row, ["value", "count", "total"]);
      if (!label || !value) {
        return null;
      }

      return {
        label,
        value,
        tone: DEFAULT_STATS[index % DEFAULT_STATS.length].tone,
      } satisfies HomepageStat;
    })
    .filter((item): item is HomepageStat => item !== null);

  return normalized.length ? normalized : DEFAULT_STATS;
};

const normalizeUniversities = (rows: RawRecord[]): UniversityRecommendation[] => {
  const normalized = rows
    .map((row, index) => {
      const name = getString(row, ["name", "university", "universityName"]);
      if (!name) {
        return null;
      }

      const country = getString(row, ["country", "location"], "N/A");
      const program = getString(row, ["program", "course", "major", "degree", "field"], "Program details");
      const id = getString(row, ["id", "_id", "slug"]) || `${name}-${country}-${program}-${index}`;

      return {
        id: id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name,
        program,
        country,
        score: normalizeScore(getString(row, ["score", "match", "fit"], "0")),
        city: getString(row, ["city", "campus"], "N/A"),
        duration: getString(row, ["duration", "programDuration"], "N/A"),
        tuition: getString(row, ["tuition", "fees", "annualFee"], "N/A"),
        ranking: getString(row, ["ranking", "rank"], "N/A"),
        intake: getString(row, ["intake", "intakes", "admissionCycle"], "N/A"),
        website: getString(row, ["website", "url", "link"], ""),
        description: getString(
          row,
          ["description", "overview", "summary"],
          "No additional details available for this university.",
        ),
      } satisfies UniversityRecommendation;
    })
    .filter((item): item is UniversityRecommendation => item !== null);

  return normalized.length ? normalized : DEFAULT_UNIVERSITIES;
};

const normalizeDeadlines = (rows: RawRecord[]): DeadlineItem[] => {
  const normalized = rows
    .map((row, index) => {
      const title = getString(row, ["title", "name", "event"]);
      const date = getString(row, ["date", "deadline", "dueDate"]);
      if (!title || !date) {
        return null;
      }

      return {
        title,
        date,
        tone: DEADLINE_TONES[index % DEADLINE_TONES.length],
      } satisfies DeadlineItem;
    })
    .filter((item): item is DeadlineItem => item !== null);

  return normalized.length ? normalized : DEFAULT_DEADLINES;
};

const parsePayload = (value: unknown): HomepagePayload => {
  const root = typeof value === "object" && value !== null ? (value as RawRecord) : {};
  const data = typeof root.data === "object" && root.data !== null ? (root.data as RawRecord) : root;

  const universityRows = asArray(data.recommendations ?? data.universities ?? data.matches ?? data.rows ?? data.items);
  const deadlineRows = asArray(data.deadlines ?? data.upcomingDeadlines);
  const statRows = asArray(data.stats ?? data.metrics);
  const universities = normalizeUniversities(universityRows);
  const fallbackStats = [
    { label: "Matches", value: String(universities.length), tone: DEFAULT_STATS[0].tone },
    { label: "Countries", value: String(new Set(universities.map((item) => item.country)).size), tone: DEFAULT_STATS[1].tone },
    { label: "Courses", value: String(new Set(universities.map((item) => item.program)).size), tone: DEFAULT_STATS[2].tone },
    { label: "Top Fit", value: universities[0]?.score || "0%", tone: DEFAULT_STATS[3].tone },
  ];

  return {
    stats: statRows.length ? normalizeStats(statRows) : fallbackStats,
    universities,
    deadlines: normalizeDeadlines(deadlineRows),
  };
};

export const fetchHomepageData = async (): Promise<HomepagePayload> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_RECOMMENDATION_ENDPOINT || API.RECOMMENDATION.LIST;
    const response = await axios.get(endpoint);
    return parsePayload(response.data);
  } catch {
    return {
      stats: DEFAULT_STATS,
      universities: DEFAULT_UNIVERSITIES,
      deadlines: DEFAULT_DEADLINES,
    };
  }
};
