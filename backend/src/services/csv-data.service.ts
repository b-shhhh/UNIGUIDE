import { promises as fs } from "fs";
import path from "path";

export type CsvUniversity = {
  id: string;
  alpha2: string;
  country: string;
  state?: string;
  city?: string;
  name: string;
  web_pages?: string;
  flag_url?: string;
  logo_url?: string;
  courses: string[];
  courseCategory?: string;
  degreeLevel?: string;
  ieltsMin?: number | null;
  satRequired?: boolean;
  satMin?: number | null;
};

let cachedUniversities: CsvUniversity[] | null = null;
let cachedMtimeMs = 0;

// New dataset uploaded as uniguide.csv with enriched columns (country/state/city/course details)
const csvFilePath = path.join(__dirname, "../uploads/uniguide.csv");

const normalize = (value: string) => value.trim().toLowerCase();

const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  values.push(current.trim());
  return values;
};

const getCountryName = (alpha2: string): string => {
  const displayNamesCtor = (Intl as any).DisplayNames;
  if (!displayNamesCtor) return alpha2;

  try {
    const displayNames = new displayNamesCtor(["en"], { type: "region" });
    return displayNames.of(alpha2) || alpha2;
  } catch (_error) {
    return alpha2;
  }
};

const splitCourses = (raw: string): string[] =>
  raw
    .split(/[|;/]/)
    .map((value) => value.trim())
    .filter(Boolean);

const defaultFlagUrl = (alpha2: string) =>
  alpha2 ? `https://flagcdn.com/w160/${alpha2.toLowerCase()}.png` : undefined;

const parseNumber = (value?: string): number | null => {
  if (value === undefined) return null;
  const num = Number(String(value).trim());
  return Number.isFinite(num) ? num : null;
};

const parseBoolean = (value?: string): boolean | undefined => {
  if (value === undefined) return undefined;
  const text = String(value).trim().toLowerCase();
  if (!text) return undefined;
  if (["1", "true", "yes", "y"].includes(text)) return true;
  if (["0", "false", "no", "n"].includes(text)) return false;
  return undefined;
};

const inferAlpha2 = (country: string, flagUrl?: string) => {
  if (flagUrl) {
    const match = flagUrl.match(/flagcdn\.com\/w\d+\/([a-z]{2})\.png/i);
    if (match) return match[1].toUpperCase();
  }
  const letters = country.replace(/[^A-Za-z]/g, "").toUpperCase();
  return letters.slice(0, 2) || "UN";
};

const logoFromWebsite = (website?: string) => {
  if (!website) return undefined;
  try {
    const hostname = new URL(website).hostname;
    if (!hostname) return undefined;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return undefined;
  }
};

const isLikelyFlagUrl = (value?: string) => {
  if (!value) return false;
  const text = value.trim().toLowerCase();
  if (!text) return false;
  if (!/^https?:\/\//.test(text)) return false;
  return (
    text.includes("flag") ||
    text.includes("flagcdn.com") ||
    text.endsWith(".png") ||
    text.endsWith(".jpg") ||
    text.endsWith(".jpeg") ||
    text.endsWith(".svg") ||
    text.endsWith(".webp")
  );
};

const extractCourseColumns = (headers: string[]) =>
  headers
    .map((header, index) => ({ header: normalize(header), index }))
    .filter(({ header }) =>
      header.includes("course") ||
      header.includes("program") ||
      header.includes("major") ||
      header.includes("subject")
    )
    .map(({ index }) => index);

const detectHeaderRow = (normalizedHeaders: string[]) => {
  // New CSV ships with headers like: country, flag_url, state, city, university, logo_url, course, course_category, degree_level, website, ielts_min, sat_required, sat_min
  return (
    normalizedHeaders.includes("country") &&
    normalizedHeaders.includes("university") &&
    normalizedHeaders.includes("course")
  );
};

const buildSyntheticHeaders = (columnCount: number) => {
  // fallback: still provide predictable column names for simple CSV without headers
  const headers = ["country", "flag_url", "state", "city", "university", "logo_url", "course", "course_category", "degree_level", "website", "ielts_min", "sat_required", "sat_min"];
  while (headers.length < columnCount) {
    headers.push(`extra_${headers.length}`);
  }
  return headers.slice(0, columnCount);
};

const readCsvUniversities = async (): Promise<CsvUniversity[]> => {
  const fileStat = await fs.stat(csvFilePath);
  if (cachedUniversities && fileStat.mtimeMs === cachedMtimeMs) {
    return cachedUniversities;
  }

  const raw = await fs.readFile(csvFilePath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 1) {
    cachedUniversities = [];
    cachedMtimeMs = fileStat.mtimeMs;
    return cachedUniversities;
  }

  const firstLineCols = parseCsvLine(lines[0]);
  const firstLineNormalized = firstLineCols.map((header) => normalize(header));
  const hasHeader = detectHeaderRow(firstLineNormalized);
  const headers = hasHeader
    ? firstLineNormalized
    : buildSyntheticHeaders(firstLineCols.length).map((header) => normalize(header));
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const countryIndex = headers.indexOf("country");
  const flagUrlIndex = headers.indexOf("flag_url");
  const stateIndex = headers.indexOf("state");
  const cityIndex = headers.indexOf("city");
  const nameIndex = headers.indexOf("university");
  const logoUrlIndex = headers.indexOf("logo_url");
  const webPagesIndex = headers.indexOf("website") >= 0 ? headers.indexOf("website") : headers.indexOf("web_pages");
  const courseIndex = headers.indexOf("course");
  const courseCategoryIndex = headers.indexOf("course_category");
  const degreeLevelIndex = headers.indexOf("degree_level");
  const ieltsIndex = headers.indexOf("ielts_min");
  const satRequiredIndex = headers.indexOf("sat_required");
  const satMinIndex = headers.indexOf("sat_min");
  const courseColumnIndexes = courseIndex >= 0 ? [courseIndex] : extractCourseColumns(headers);

  const universities = dataLines.map((line, rowIndex) => {
    const cols = parseCsvLine(line);
    const countryName = cols[countryIndex] || "";
    const flagUrl = flagUrlIndex >= 0 ? cols[flagUrlIndex] : undefined;
    const alpha2 = inferAlpha2(countryName, flagUrl);
    const name = cols[nameIndex] || "";
    const courses = courseColumnIndexes.flatMap((index) => splitCourses(cols[index] || ""));
    const webPage = cols[webPagesIndex] || undefined;
    const logoUrl = cols[logoUrlIndex] || logoFromWebsite(webPage);
    const courseCategory = courseCategoryIndex >= 0 ? cols[courseCategoryIndex] || undefined : undefined;
    const degreeLevel = degreeLevelIndex >= 0 ? cols[degreeLevelIndex] || undefined : undefined;

    return {
      id: `csv-${rowIndex + 1}`,
      alpha2,
      country: countryName || getCountryName(alpha2),
      state: stateIndex >= 0 ? cols[stateIndex] || undefined : undefined,
      city: cityIndex >= 0 ? cols[cityIndex] || undefined : undefined,
      name,
      web_pages: webPage,
      flag_url: flagUrl || defaultFlagUrl(alpha2),
      logo_url: logoUrl,
      courses: Array.from(new Set(courses)),
      courseCategory,
      degreeLevel,
      ieltsMin: parseNumber(ieltsIndex >= 0 ? cols[ieltsIndex] : undefined),
      satRequired: parseBoolean(satRequiredIndex >= 0 ? cols[satRequiredIndex] : undefined),
      satMin: parseNumber(satMinIndex >= 0 ? cols[satMinIndex] : undefined),
    };
  }).filter((uni) => Boolean(uni.name));

  cachedUniversities = universities;
  cachedMtimeMs = fileStat.mtimeMs;
  return universities;
};

export const getCsvUniversities = async (): Promise<CsvUniversity[]> => {
  return readCsvUniversities();
};

export const getCsvCountries = async (): Promise<string[]> => {
  const universities = await readCsvUniversities();
  return Array.from(new Set(universities.map((uni) => uni.country))).sort((a, b) => a.localeCompare(b));
};

export const getCsvUniversitiesByCountry = async (country: string): Promise<CsvUniversity[]> => {
  const normalizedCountry = normalize(country);
  const universities = await readCsvUniversities();
  return universities.filter(
    (uni) => normalize(uni.country) === normalizedCountry || normalize(uni.alpha2) === normalizedCountry
  );
};

export const getCsvUniversityById = async (id: string): Promise<CsvUniversity | null> => {
  const universities = await readCsvUniversities();
  return universities.find((uni) => uni.id === id) || null;
};

export const getCsvCourses = async (): Promise<string[]> => {
  const universities = await readCsvUniversities();
  const courses = universities.flatMap((uni) => uni.courses);
  return Array.from(new Set(courses)).sort((a, b) => a.localeCompare(b));
};

export const getCsvCourseByName = async (name: string): Promise<string | null> => {
  const courses = await getCsvCourses();
  const normalizedName = normalize(name);
  return courses.find((course) => normalize(course) === normalizedName) || null;
};

export const getCsvCoursesByCountry = async (country: string): Promise<string[]> => {
  const universities = await getCsvUniversitiesByCountry(country);
  const courses = universities.flatMap((uni) => uni.courses);
  return Array.from(new Set(courses)).sort((a, b) => a.localeCompare(b));
};
