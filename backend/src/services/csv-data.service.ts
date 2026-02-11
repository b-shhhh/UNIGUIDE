import { promises as fs } from "fs";
import path from "path";

export type CsvUniversity = {
  id: string;
  alpha2: string;
  country: string;
  name: string;
  web_pages?: string;
  flag_url?: string;
  courses: string[];
};

let cachedUniversities: CsvUniversity[] | null = null;
let cachedMtimeMs = 0;

const csvFilePath = path.join(__dirname, "../uploads/universities.csv");

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

const readCsvUniversities = async (): Promise<CsvUniversity[]> => {
  const fileStat = await fs.stat(csvFilePath);
  if (cachedUniversities && fileStat.mtimeMs === cachedMtimeMs) {
    return cachedUniversities;
  }

  const raw = await fs.readFile(csvFilePath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    cachedUniversities = [];
    cachedMtimeMs = fileStat.mtimeMs;
    return cachedUniversities;
  }

  const headers = parseCsvLine(lines[0]).map((header) => normalize(header));
  const alpha2Index = headers.indexOf("alpha2");
  const nameIndex = headers.indexOf("name");
  const webPagesIndex = headers.indexOf("web_pages");
  const flagUrlIndex = headers.indexOf("flag_url");
  const courseColumnIndexes = extractCourseColumns(headers);

  const universities = lines.slice(1).map((line, rowIndex) => {
    const cols = parseCsvLine(line);
    const alpha2 = (cols[alpha2Index] || "").toUpperCase();
    const name = cols[nameIndex] || "";
    const courses = courseColumnIndexes.flatMap((index) => splitCourses(cols[index] || ""));

    return {
      id: `csv-${rowIndex + 1}`,
      alpha2,
      country: getCountryName(alpha2),
      name,
      web_pages: cols[webPagesIndex] || undefined,
      flag_url: cols[flagUrlIndex] || undefined,
      courses: Array.from(new Set(courses))
    };
  });

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
