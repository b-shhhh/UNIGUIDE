import { NextRequest, NextResponse } from "next/server";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type ParsedFilters = {
  country?: string;
  course?: string;
  budget?: number | string;
  min_ielts?: number;
  min_gpa?: number;
  intake?: string;
  mode?: "online" | "offline" | "both";
};

type BackendUniversity = {
  id: string;
  alpha2: string;
  country: string;
  name: string;
  web_pages?: string;
  flag_url?: string;
  logo_url?: string;
  courses: string[];
};

type ChatResultCard = {
  id: string;
  name: string;
  country: string;
  courses: string[];
  tuition: string;
  viewDetailsUrl: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5050";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const normalize = (value: string) => value.trim().toLowerCase();

const hashCode = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const syntheticTuition = (id: string) => {
  const value = 8000 + (hashCode(id) % 55) * 1000;
  return `$${value.toLocaleString()}/year`;
};

const parseTuitionNumber = (text: string) => {
  const match = text.match(/\$([\d,]+)/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1].replace(/,/g, ""));
};

const parseBudgetRange = (budget?: number | string) => {
  if (typeof budget === "number") {
    return { min: null as number | null, max: budget };
  }
  if (!budget) {
    return { min: null as number | null, max: null as number | null };
  }

  const raw = String(budget).trim().toLowerCase();
  if (raw === "low") return { min: null as number | null, max: 15000 };

  if (raw.startsWith("<")) {
    const max = Number(raw.slice(1));
    return { min: null as number | null, max: Number.isFinite(max) ? max : null };
  }

  if (raw.includes("-")) {
    const [low, high] = raw.split("-").map((item) => Number(item.trim()));
    return {
      min: Number.isFinite(low) ? low : null,
      max: Number.isFinite(high) ? high : null,
    };
  }

  const exact = Number(raw);
  if (Number.isFinite(exact)) return { min: null as number | null, max: exact };
  return { min: null as number | null, max: null as number | null };
};

const extractFiltersWithOpenAI = async (message: string): Promise<ParsedFilters> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return {};

  const prompt = `
You are an AI that extracts structured search filters from user messages for a university finder app.
Return valid JSON only. Allowed keys: country, course, budget, min_ielts, min_gpa, intake, mode.
Rules:
- mode must be one of: online, offline, both
- min_ielts and min_gpa must be numbers
- budget may be number or string forms like "<15000", "5000-15000", "low"
- if not present, omit key
User message: ${message}
`.trim();

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: "Return only JSON object with the allowed keys." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) return {};
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) return {};

  try {
    const parsed = JSON.parse(content) as ParsedFilters;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const extractFiltersFallback = (message: string, rows: BackendUniversity[]): ParsedFilters => {
  const text = normalize(message);
  const countries = Array.from(new Set(rows.map((row) => row.country)));
  const courses = Array.from(new Set(rows.flatMap((row) => row.courses)));

  const country = countries.find((name) => text.includes(normalize(name)));
  const course = courses.find((name) => text.includes(normalize(name)));

  const under = text.match(/(?:under|below|less than|max|upto|up to)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  let budget: ParsedFilters["budget"] = undefined;
  if (under) {
    const val = Number(under[1].replace(/,/g, "")) * (under[2] ? 1000 : 1);
    if (Number.isFinite(val)) budget = `<${val}`;
  } else if (/(affordable|cheap|low budget|low tuition)/i.test(text)) {
    budget = "low";
  }

  return {
    country,
    course,
    budget,
  };
};

const fetchAllUniversitiesFromBackend = async (): Promise<BackendUniversity[]> => {
  const response = await fetch(`${API_BASE_URL}/api/universities`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch universities from backend");
  }
  const payload = (await response.json()) as { data?: BackendUniversity[] };
  return Array.isArray(payload.data) ? payload.data : [];
};

const applyFilters = (rows: BackendUniversity[], filters: ParsedFilters) => {
  const countryNeedle = filters.country ? normalize(filters.country) : "";
  const courseNeedle = filters.course ? normalize(filters.course) : "";
  const budget = parseBudgetRange(filters.budget);

  return rows.filter((row) => {
    if (countryNeedle && !normalize(row.country).includes(countryNeedle)) {
      return false;
    }

    if (courseNeedle) {
      const hasCourse = row.courses.some((course) => normalize(course).includes(courseNeedle));
      if (!hasCourse) return false;
    }

    const tuitionNumber = parseTuitionNumber(syntheticTuition(row.id));
    if (budget.min !== null && tuitionNumber < budget.min) return false;
    if (budget.max !== null && tuitionNumber > budget.max) return false;

    return true;
  });
};

const scoreRows = (rows: BackendUniversity[], message: string, filters: ParsedFilters) => {
  const tokens = normalize(message)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return rows
    .map((row) => {
      const haystack = `${row.name} ${row.country} ${row.courses.join(" ")}`.toLowerCase();
      const tokenScore = tokens.reduce((acc, token) => (haystack.includes(token) ? acc + 1 : acc), 0);
      const courseBoost = filters.course && row.courses.some((course) => normalize(course).includes(normalize(filters.course!))) ? 3 : 0;
      return { row, score: tokenScore + courseBoost };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.row);
};

const buildBotReply = (filters: ParsedFilters, count: number) => {
  const parts: string[] = [];
  if (filters.country) parts.push(`country: ${filters.country}`);
  if (filters.course) parts.push(`course: ${filters.course}`);
  if (filters.budget !== undefined) parts.push(`budget: ${filters.budget}`);
  if (filters.min_ielts !== undefined) parts.push(`IELTS >= ${filters.min_ielts}`);
  if (filters.min_gpa !== undefined) parts.push(`GPA >= ${filters.min_gpa}`);
  if (filters.intake) parts.push(`intake: ${filters.intake}`);
  if (filters.mode) parts.push(`mode: ${filters.mode}`);

  if (!parts.length) {
    return count ? `Found ${count} universities.` : "No matches found.";
  }
  return `Applied filters (${parts.join(", ")}). Found ${count} universities.`;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string; history?: ChatTurn[] };
  const message = String(body.message || "").trim();
  if (!message) {
    return NextResponse.json({ answer: "Please enter a message.", filters: {}, results: [] });
  }

  const backendRows = await fetchAllUniversitiesFromBackend();
  const aiFilters = await extractFiltersWithOpenAI(message);
  const filters = Object.keys(aiFilters).length ? aiFilters : extractFiltersFallback(message, backendRows);
  const filtered = applyFilters(backendRows, filters);
  const ranked = scoreRows(filtered, message, filters).slice(0, 8);

  const results: ChatResultCard[] = ranked.map((row) => ({
    id: row.id,
    name: row.name,
    country: row.country,
    courses: row.courses,
    tuition: syntheticTuition(row.id),
    viewDetailsUrl: `/homepage/universities/${row.id}`,
  }));

  return NextResponse.json({
    answer: buildBotReply(filters, results.length),
    filters,
    results,
  });
}
