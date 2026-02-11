import { readFile } from "node:fs/promises";
import path from "node:path";

export type CsvUniversity = {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  countryFlagUrl: string;
  name: string;
  website: string;
  logoUrl: string;
  course: string;
  courseSlug: string;
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
};

type CsvRow = {
  countryCode: string;
  name: string;
  website: string;
};

const COURSE_POOL = [
  "Computer Science",
  "Data Science",
  "Artificial Intelligence",
  "Cyber Security",
  "Business Analytics",
  "Cloud Computing",
  "Software Engineering",
  "Information Systems",
  "Machine Learning",
  "Electrical Engineering",
  "Bioinformatics",
  "Digital Marketing",
] as const;

const DURATION_POOL = ["1 year", "1.5 years", "2 years", "3 years"] as const;
const INTAKE_POOL = ["January", "February", "September", "October"] as const;

const MANUAL_FLAG_MAP: Record<string, string> = {
  AD: "🇦🇩",
  AE: "🇦🇪",
  AF: "🇦🇫",
  AL: "🇦🇱",
  AM: "🇦🇲",
  AO: "🇦🇴",
  AR: "🇦🇷",
  AT: "🇦🇹",
  AU: "🇦🇺",
  AZ: "🇦🇿",
  BA: "🇧🇦",
  BD: "🇧🇩",
  BE: "🇧🇪",
  BG: "🇧🇬",
  BH: "🇧🇭",
  BO: "🇧🇴",
  BR: "🇧🇷",
  BY: "🇧🇾",
  CA: "🇨🇦",
  CH: "🇨🇭",
  CL: "🇨🇱",
  CN: "🇨🇳",
  CO: "🇨🇴",
  CR: "🇨🇷",
  CY: "🇨🇾",
  CZ: "🇨🇿",
  DE: "🇩🇪",
  DK: "🇩🇰",
  DO: "🇩🇴",
  DZ: "🇩🇿",
  EC: "🇪🇨",
  EE: "🇪🇪",
  EG: "🇪🇬",
  ES: "🇪🇸",
  ET: "🇪🇹",
  FI: "🇫🇮",
  FR: "🇫🇷",
  GB: "🇬🇧",
  GE: "🇬🇪",
  GH: "🇬🇭",
  GR: "🇬🇷",
  HK: "🇭🇰",
  HR: "🇭🇷",
  HU: "🇭🇺",
  ID: "🇮🇩",
  IE: "🇮🇪",
  IL: "🇮🇱",
  IN: "🇮🇳",
  IQ: "🇮🇶",
  IR: "🇮🇷",
  IS: "🇮🇸",
  IT: "🇮🇹",
  JO: "🇯🇴",
  JP: "🇯🇵",
  KE: "🇰🇪",
  KG: "🇰🇬",
  KH: "🇰🇭",
  KR: "🇰🇷",
  KW: "🇰🇼",
  KZ: "🇰🇿",
  LB: "🇱🇧",
  LK: "🇱🇰",
  LT: "🇱🇹",
  LU: "🇱🇺",
  LV: "🇱🇻",
  MA: "🇲🇦",
  MD: "🇲🇩",
  MK: "🇲🇰",
  MM: "🇲🇲",
  MN: "🇲🇳",
  MT: "🇲🇹",
  MX: "🇲🇽",
  MY: "🇲🇾",
  NG: "🇳🇬",
  NL: "🇳🇱",
  NO: "🇳🇴",
  NP: "🇳🇵",
  NZ: "🇳🇿",
  OM: "🇴🇲",
  PA: "🇵🇦",
  PE: "🇵🇪",
  PH: "🇵🇭",
  PK: "🇵🇰",
  PL: "🇵🇱",
  PT: "🇵🇹",
  QA: "🇶🇦",
  RO: "🇷🇴",
  RS: "🇷🇸",
  RU: "🇷🇺",
  SA: "🇸🇦",
  SE: "🇸🇪",
  SG: "🇸🇬",
  SI: "🇸🇮",
  SK: "🇸🇰",
  TH: "🇹🇭",
  TN: "🇹🇳",
  TR: "🇹🇷",
  TW: "🇹🇼",
  UA: "🇺🇦",
  US: "🇺🇸",
  UY: "🇺🇾",
  UZ: "🇺🇿",
  VE: "🇻🇪",
  VN: "🇻🇳",
  ZA: "🇿🇦",
  UK: "🇬🇧",
};

let cachedUniversities: CsvUniversity[] | null = null;

const csvCandidates = () => [
  path.resolve(process.cwd(), "../backend/src/uploads/universities.csv"),
  path.resolve(process.cwd(), "backend/src/uploads/universities.csv"),
];

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
  if (MANUAL_FLAG_MAP[code]) {
    return MANUAL_FLAG_MAP[code];
  }
  if (!/^[A-Z]{2}$/.test(code)) {
    return "??";
  }
  return String.fromCodePoint(code.charCodeAt(0) + 127397, code.charCodeAt(1) + 127397);
};

const getFlagImageUrl = (countryCode: string) => {
  const code = countryCode.toLowerCase() === "uk" ? "gb" : countryCode.toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) {
    return "";
  }
  return `https://flagcdn.com/w80/${code}.png`;
};

const countryNameFromCode = (countryCode: string) => {
  try {
    const display = new Intl.DisplayNames(["en"], { type: "region" });
    return display.of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
};

const getLogoFromWebsite = (website: string) => {
  if (!website) {
    return "";
  }
  try {
    const url = new URL(website);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return "";
  }
};

const parseCsvLine = (line: string): string[] => {
  const output: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      output.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }
  output.push(current.trim());
  return output;
};

const parseCsv = (csvText: string): CsvRow[] => {
  return csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseCsvLine(line))
    .filter((parts) => parts.length >= 3)
    .map((parts) => ({
      countryCode: (parts[0] || "").toUpperCase(),
      name: parts[1] || "",
      website: parts[2] || "",
    }))
    .filter((row) => row.countryCode && row.name);
};

const buildUniversity = (row: CsvRow, id: string): CsvUniversity => {
  const key = `${row.countryCode}-${row.name}`;
  const hash = hashCode(key);
  const course = COURSE_POOL[hash % COURSE_POOL.length];
  const tuitionValue = 8000 + (hash % 55) * 1000;

  return {
    id,
    countryCode: row.countryCode,
    countryName: countryNameFromCode(row.countryCode),
    flag: toFlagEmoji(row.countryCode),
    countryFlagUrl: getFlagImageUrl(row.countryCode),
    name: row.name,
    website: row.website,
    logoUrl: getLogoFromWebsite(row.website),
    course,
    courseSlug: slugify(course),
    score: 70 + (hash % 30),
    tuition: `$${tuitionValue.toLocaleString()}/year`,
    ranking: `Top ${10 + (hash % 250)}`,
    duration: DURATION_POOL[hash % DURATION_POOL.length],
    intake: INTAKE_POOL[hash % INTAKE_POOL.length],
    description: `${row.name} in ${countryNameFromCode(row.countryCode)} offers a strong ${course} pathway for international students.`,
  };
};

const readCsvText = async (): Promise<string> => {
  for (const candidate of csvCandidates()) {
    try {
      return await readFile(candidate, "utf8");
    } catch {
      continue;
    }
  }
  throw new Error("universities.csv not found in backend/src/uploads");
};

export const getUniversities = async (): Promise<CsvUniversity[]> => {
  if (cachedUniversities) {
    return cachedUniversities;
  }

  const text = await readCsvText();
  const parsed = parseCsv(text);
  const idCounts = new Map<string, number>();
  cachedUniversities = parsed.map((row) => {
    const baseId = slugify(`${row.countryCode}-${row.name}`);
    const seen = idCounts.get(baseId) ?? 0;
    idCounts.set(baseId, seen + 1);
    const uniqueId = seen === 0 ? baseId : `${baseId}-${seen + 1}`;
    return buildUniversity(row, uniqueId);
  });
  return cachedUniversities;
};

export const getCountries = async (): Promise<CountrySummary[]> => {
  const universities = await getUniversities();
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

export const getCourses = async (): Promise<CourseSummary[]> => {
  const universities = await getUniversities();
  const map = new Map<string, CourseSummary>();

  for (const uni of universities) {
    const current = map.get(uni.courseSlug);
    if (current) {
      current.count += 1;
      continue;
    }
    map.set(uni.courseSlug, {
      slug: uni.courseSlug,
      name: uni.course,
      count: 1,
    });
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
};

export const getUniversitiesByCountry = async (countryCode: string) => {
  const universities = await getUniversities();
  const code = countryCode.toUpperCase();
  return universities.filter((item) => item.countryCode === code);
};

export const getUniversitiesByCourse = async (courseSlug: string) => {
  const universities = await getUniversities();
  return universities.filter((item) => item.courseSlug === courseSlug);
};

export const getUniversityById = async (id: string) => {
  const universities = await getUniversities();
  return universities.find((item) => item.id === id) || null;
};
