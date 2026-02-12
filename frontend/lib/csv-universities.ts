export type CsvUniversity = {
  id: string;
  dbId?: string;
  countryCode: string;
  countryName: string;
  flag: string;
  countryFlagUrl: string;
  name: string;
  website: string;
  logoUrl: string;
  course: string;
  courseSlug: string;
  courses: string[];
  score: number;
  tuition: string;
  ranking: string;
  duration: string;
  intake: string;
  description: string;
};

export type CountrySummary = {
  code: string;
  name: string;
  flag: string;
  flagImageUrl: string;
  count: number;
};

export type CourseSummary = {
  name: string;
  slug: string;
  count: number;
  sampleCountry: string;
  sampleUniversity: string;
  countryCount: number;
};

type BackendUniversity = {
  id: string;
  dbId?: string;
  alpha2?: string;
  country: string;
  name: string;
  web_pages?: string;
  flag_url?: string;
  logo_url?: string;
  courses: string[];
  description?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const DURATION_POOL = ["1 year", "1.5 years", "2 years", "3 years"] as const;
const INTAKE_POOL = ["January", "February", "September", "October"] as const;

const apiBaseCandidates = () => {
  const fromEnv = API_BASE_URL.trim();
  const candidates = [
    fromEnv,
    "http://127.0.0.1:5050",
    "http://localhost:5050",
  ].filter(Boolean);
  return Array.from(new Set(candidates));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const hashCode = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const toFlagEmoji = (countryCode: string) => {
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return "??";
  }
  return String.fromCodePoint(code.charCodeAt(0) + 127397, code.charCodeAt(1) + 127397);
};

const toFlagImageUrl = (countryCode: string) => {
  const code = countryCode.toLowerCase() === "uk" ? "gb" : countryCode.toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) {
    return "";
  }
  return `https://flagcdn.com/w80/${code}.png`;
};

const normalizeLogoUrl = (logoUrl: string | undefined) => {
  if (logoUrl && !/gstatic\.com\/faviconV2|google\.com\/s2\/favicons|icons\.duckduckgo\.com\/ip3/i.test(logoUrl)) {
    return logoUrl;
  }
  return "";
};

const inferCountryCode = (alpha2: string | undefined, countryName: string) => {
  if (alpha2 && /^[A-Za-z]{2}$/.test(alpha2.trim())) {
    return alpha2.trim().toUpperCase();
  }
  const letters = countryName.replace(/[^A-Za-z]/g, "").toUpperCase();
  return letters.slice(0, 2) || "UN";
};

const mapUniversity = (row: BackendUniversity): CsvUniversity => {
  const code = inferCountryCode(row.alpha2, row.country);
  const key = `${row.id}-${row.country}-${row.name}`;
  const hash = hashCode(key);
  const courseList = Array.isArray(row.courses) ? row.courses.filter(Boolean) : [];
  const primaryCourse = courseList[0] || "N/A";
  const tuitionValue = 8000 + (hash % 55) * 1000;

  return {
    id: row.id,
    dbId: row.dbId || undefined,
    countryCode: code,
    countryName: row.country,
    flag: toFlagEmoji(code),
    countryFlagUrl: row.flag_url || toFlagImageUrl(code),
    name: row.name,
    website: row.web_pages || "",
    logoUrl: normalizeLogoUrl(row.logo_url),
    course: primaryCourse,
    courseSlug: primaryCourse === "N/A" ? "" : slugify(primaryCourse),
    courses: courseList,
    score: 70 + (hash % 30),
    tuition: `$${tuitionValue.toLocaleString()}/year`,
    ranking: `Top ${10 + (hash % 250)}`,
    duration: DURATION_POOL[hash % DURATION_POOL.length],
    intake: INTAKE_POOL[hash % INTAKE_POOL.length],
    description: row.description || `${row.name} in ${row.country} offers multiple programs.`,
  };
};

const fetchAllUniversities = async (): Promise<CsvUniversity[]> => {
  const errors: string[] = [];

  for (const base of apiBaseCandidates()) {
    try {
      const response = await fetch(`${base}/api/universities`, { next: { revalidate: 300 } });
      if (!response.ok) {
        errors.push(`${base} -> HTTP ${response.status}`);
        continue;
      }
      const payload = (await response.json()) as { data?: BackendUniversity[] };
      const rows = Array.isArray(payload.data) ? payload.data : [];
      return rows.map(mapUniversity);
    } catch (error) {
      errors.push(`${base} -> ${error instanceof Error ? error.message : "network error"}`);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("Failed to fetch universities from backend:", errors.join(" | "));
  }
  return [];
};

export const getUniversities = async (): Promise<CsvUniversity[]> => {
  return fetchAllUniversities();
};

export const buildCountries = (universities: CsvUniversity[]): CountrySummary[] => {
  const map = new Map<string, CountrySummary>();

  for (const uni of universities) {
    const current = map.get(uni.countryCode);
    if (current) {
      current.count += 1;
      continue;
    }
    map.set(uni.countryCode, {
      code: uni.countryCode,
      name: uni.countryName,
      flag: uni.flag,
      flagImageUrl: uni.countryFlagUrl,
      count: 1,
    });
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
};

export const getCountries = async (): Promise<CountrySummary[]> => {
  const universities = await getUniversities();
  return buildCountries(universities);
};

export const buildCourses = (universities: CsvUniversity[]): CourseSummary[] => {
  const map = new Map<string, CourseSummary & { countrySet: Set<string> }>();

  for (const uni of universities) {
    for (const courseName of uni.courses) {
      const courseSlug = slugify(courseName);
      if (!courseSlug) {
        continue;
      }
      const current = map.get(courseSlug);
      if (current) {
        current.count += 1;
        current.countrySet.add(uni.countryName);
        continue;
      }
      map.set(courseSlug, {
        slug: courseSlug,
        name: courseName,
        count: 1,
        sampleCountry: uni.countryName,
        sampleUniversity: uni.name,
        countryCount: 1,
        countrySet: new Set([uni.countryName]),
      });
    }
  }

  return Array.from(map.values())
    .map(({ countrySet, ...course }) => ({
      ...course,
      countryCount: countrySet.size,
    }))
    .sort((a, b) => b.count - a.count);
};

export const getCourses = async (): Promise<CourseSummary[]> => {
  const universities = await getUniversities();
  return buildCourses(universities);
};

export const getUniversitiesByCountry = async (countryCode: string) => {
  const universities = await getUniversities();
  const code = countryCode.toUpperCase();
  return universities.filter((item) => item.countryCode === code);
};

export const getUniversitiesByCourse = async (courseSlug: string) => {
  const universities = await getUniversities();
  return universities.filter(
    (item) => item.courseSlug === courseSlug || item.courses.some((course) => slugify(course) === courseSlug),
  );
};

export const getUniversityById = async (id: string) => {
  for (const base of apiBaseCandidates()) {
    try {
      const response = await fetch(`${base}/api/universities/${id}`, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      const payload = (await response.json()) as { data?: BackendUniversity };
      if (!payload.data) {
        return null;
      }
      return mapUniversity(payload.data);
    } catch {
      continue;
    }
  }
  return null;
};
