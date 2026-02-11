import { NextRequest, NextResponse } from "next/server";
import { getUniversities } from "@/lib/csv-universities";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  recommendationIds?: string[];
};

type ExtractedFilters = {
  countries: string[];
  countryCodes: string[];
  courses: string[];
  budgetMax: number | null;
  budgetMin: number | null;
  ieltsMin: number | null;
  topN: number;
  sortBy: "relevance" | "rank" | "tuition_asc" | "score";
  followPrevious: boolean;
};

const COURSE_ALIASES: Record<string, string[]> = {
  cs: ["computer science"],
  ai: ["artificial intelligence", "data science", "machine learning"],
  medicine: ["medicine & dentistry", "veterinary science", "biological sciences"],
  business: ["business & management", "economics & econometrics", "accounting & finance"],
  engineering: ["general engineering", "mechanical & aerospace engineering", "civil engineering"],
  law: ["law"],
};

const normalize = (value: string) => value.trim().toLowerCase();

const tokenize = (text: string) =>
  normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const toAmount = (raw: string, hasK: boolean) => {
  const value = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(value)) {
    return null;
  }
  return hasK ? value * 1000 : value;
};

const parseBudgetRange = (text: string) => {
  const under = text.match(/(?:under|below|less than|max(?:imum)?|upto|up to)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  if (under) {
    return { min: null, max: toAmount(under[1], Boolean(under[2])) };
  }

  const over = text.match(/(?:over|above|more than|min(?:imum)?)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  if (over) {
    return { min: toAmount(over[1], Boolean(over[2])), max: null };
  }

  const between = text.match(
    /(?:between)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?\s*(?:and|-)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i,
  );
  if (between) {
    return {
      min: toAmount(between[1], Boolean(between[2])),
      max: toAmount(between[3], Boolean(between[4])),
    };
  }

  return { min: null, max: null };
};

const parseTuition = (tuition: string) => {
  const match = tuition.match(/\$([\d,]+)/);
  if (!match) {
    return Number.POSITIVE_INFINITY;
  }
  return Number(match[1].replace(/,/g, ""));
};

const rankFromText = (ranking: string) => {
  const match = ranking.match(/\d+/);
  return match ? Number(match[0]) : 9999;
};

const parseTopN = (text: string) => {
  const explicit = text.match(/\btop\s+(\d{1,2})\b/i) || text.match(/\bbest\s+(\d{1,2})\b/i);
  if (explicit) {
    const n = Number(explicit[1]);
    if (Number.isFinite(n)) {
      return Math.max(1, Math.min(15, n));
    }
  }
  return 5;
};

const parseIelts = (text: string) => {
  const match = text.match(/ielts\s*(?:score)?\s*(\d(?:\.\d)?)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
};

const parseSortBy = (text: string): ExtractedFilters["sortBy"] => {
  const normalized = normalize(text);
  if (/(affordable|cheap|low tuition|budget|lowest|least expensive)/.test(normalized)) {
    return "tuition_asc";
  }
  if (/(top|best|rank|ranking|world class)/.test(normalized)) {
    return "rank";
  }
  if (/(score|highest ai score)/.test(normalized)) {
    return "score";
  }
  return "relevance";
};

const buildFilters = (queryText: string, countryLookup: Map<string, string>, knownCourses: string[]): ExtractedFilters => {
  const normalized = normalize(queryText);
  const budget = parseBudgetRange(queryText);

  const countryCodes = Array.from(countryLookup.entries())
    .filter(([nameOrCode]) => {
      const escaped = nameOrCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(normalized);
    })
    .map(([, code]) => code);

  const uniqueCountryCodes = Array.from(new Set(countryCodes));
  const countries = uniqueCountryCodes.map((code) => {
    for (const [name, mappedCode] of countryLookup.entries()) {
      if (mappedCode === code && name.length > 2) return name;
    }
    return code;
  });

  const matchedCourses = knownCourses.filter((course) => {
    const courseNorm = normalize(course);
    if (!courseNorm) return false;
    if (normalized.includes(courseNorm)) return true;

    return Object.entries(COURSE_ALIASES).some(([alias, expansions]) => {
      if (!new RegExp(`\\b${alias}\\b`, "i").test(normalized)) return false;
      return expansions.some((item) => courseNorm.includes(item));
    });
  });

  return {
    countries,
    countryCodes: uniqueCountryCodes,
    courses: matchedCourses,
    budgetMin: budget.min,
    budgetMax: budget.max,
    ieltsMin: parseIelts(queryText),
    topN: parseTopN(queryText),
    sortBy: parseSortBy(queryText),
    followPrevious: /(among these|among them|best among|from these|out of these|which one)/i.test(normalized),
  };
};

const summarizeFilters = (filters: ExtractedFilters) => {
  const parts: string[] = [];
  if (filters.countryCodes.length) parts.push(`countries: ${filters.countries.join(", ")}`);
  if (filters.courses.length) parts.push(`courses: ${filters.courses.slice(0, 3).join(", ")}`);
  if (filters.budgetMax !== null) parts.push(`max budget: $${filters.budgetMax.toLocaleString()}`);
  if (filters.budgetMin !== null) parts.push(`min budget: $${filters.budgetMin.toLocaleString()}`);
  if (filters.ieltsMin !== null) parts.push(`IELTS: ${filters.ieltsMin}+`);
  parts.push(`sort: ${filters.sortBy}`);
  return parts.join(" | ");
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string; history?: ChatTurn[] };
  const message = (body.message || "").trim();
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  if (!message) {
    return NextResponse.json({ answer: "Ask a question first.", recommendations: [], filterSummary: "" });
  }

  const universities = await getUniversities();
  const knownCourses = Array.from(new Set(universities.flatMap((uni) => uni.courses)));
  const countryLookup = new Map<string, string>();
  for (const uni of universities) {
    countryLookup.set(normalize(uni.countryCode), uni.countryCode);
    countryLookup.set(normalize(uni.countryName), uni.countryCode);
  }

  const priorUserContext = history
    .filter((turn) => turn.role === "user")
    .map((turn) => turn.content)
    .join(" ");
  const queryText = `${priorUserContext} ${message}`.trim();
  const filters = buildFilters(queryText, countryLookup, knownCourses);

  const previousRecommendationIds = history.flatMap((turn) => (Array.isArray(turn.recommendationIds) ? turn.recommendationIds : []));
  const previousRecommendationSet = new Set(previousRecommendationIds);

  const tokens = tokenize(message);
  const scored = universities.map((uni) => {
    if (filters.followPrevious && previousRecommendationSet.size && !previousRecommendationSet.has(uni.id)) {
      return { uni, score: Number.NEGATIVE_INFINITY };
    }

    if (filters.countryCodes.length && !filters.countryCodes.includes(uni.countryCode)) {
      return { uni, score: Number.NEGATIVE_INFINITY };
    }

    if (filters.courses.length) {
      const uniCourses = uni.courses.map((course) => normalize(course));
      const hasCourseMatch = filters.courses.some((course) => uniCourses.includes(normalize(course)));
      if (!hasCourseMatch) {
        return { uni, score: Number.NEGATIVE_INFINITY };
      }
    }

    const tuition = parseTuition(uni.tuition);
    if (filters.budgetMax !== null && tuition > filters.budgetMax) {
      return { uni, score: Number.NEGATIVE_INFINITY };
    }
    if (filters.budgetMin !== null && tuition < filters.budgetMin) {
      return { uni, score: Number.NEGATIVE_INFINITY };
    }

    const haystack = `${uni.name} ${uni.countryName} ${uni.countryCode} ${uni.courses.join(" ")} ${uni.description}`.toLowerCase();
    const tokenHits = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0);
    const rankScore = Math.max(0, 300 - rankFromText(uni.ranking)) / 50;
    const aiScore = uni.score / 100;
    const tuitionScore = Math.max(0, 60000 - tuition) / 60000;
    const score = tokenHits * 2.2 + rankScore + aiScore + tuitionScore;

    return { uni, score };
  });

  let candidates = scored.filter((item) => Number.isFinite(item.score));

  if (!candidates.length && filters.followPrevious && previousRecommendationSet.size) {
    candidates = scored
      .filter((item) => previousRecommendationSet.has(item.uni.id))
      .map((item) => ({ ...item, score: item.score === Number.NEGATIVE_INFINITY ? 0 : item.score }));
  }

  switch (filters.sortBy) {
    case "rank":
      candidates.sort((a, b) => rankFromText(a.uni.ranking) - rankFromText(b.uni.ranking));
      break;
    case "tuition_asc":
      candidates.sort((a, b) => parseTuition(a.uni.tuition) - parseTuition(b.uni.tuition));
      break;
    case "score":
      candidates.sort((a, b) => b.uni.score - a.uni.score);
      break;
    default:
      candidates.sort((a, b) => b.score - a.score);
      break;
  }

  const shortlist = candidates.slice(0, 40).map((item) => item.uni);

  const bestCountries = Object.values(
    shortlist.reduce<Record<string, { country: string; count: number; avgScore: number }>>((acc, uni) => {
      const key = uni.countryCode;
      const current = acc[key];
      if (!current) {
        acc[key] = { country: uni.countryName, count: 1, avgScore: uni.score };
        return acc;
      }
      current.count += 1;
      current.avgScore += uni.score;
      return acc;
    }, {}),
  )
    .map((entry) => ({
      country: entry.country,
      count: entry.count,
      avgScore: entry.avgScore / entry.count,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  const recommendationIds = shortlist.slice(0, filters.topN).map((item) => item.id);
  const gotItLine = (() => {
    const countryPart = filters.countries.length ? ` in ${filters.countries[0]}` : "";
    const coursePart = filters.courses.length ? ` for ${filters.courses[0]}` : "";
    const tuitionPart =
      filters.budgetMax !== null || filters.sortBy === "tuition_asc" ? " under low tuition" : "";
    return `Got it. Searching universities${countryPart}${coursePart}${tuitionPart}...`;
  })();

  const updatedLine = (() => {
    const segments: string[] = [];
    if (filters.ieltsMin !== null) {
      segments.push(`IELTS ${filters.ieltsMin}`);
    }
    if (filters.budgetMax !== null) {
      segments.push(`$${Math.round(filters.budgetMax / 1000)}k budget`);
    }
    return segments.length ? `Updated results based on ${segments.join(" and ")}.` : "";
  })();

  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey && shortlist.length) {
    const context = shortlist
      .slice(0, 25)
      .map(
        (u) =>
          `${u.id} | ${u.name} | ${u.countryName} | courses: ${u.courses.join(", ")} | ${u.tuition} | ${u.ranking} | score ${u.score}%`,
      )
      .join("\n");

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are UniGuide assistant. Answer naturally, but ONLY use given CSV context. Never invent universities/countries/courses. If missing in context, say it is not found in CSV data.",
          },
          ...history.map((turn) => ({ role: turn.role, content: turn.content })),
          {
            role: "user",
            content: `User question: ${message}\nApplied filters: ${summarizeFilters(filters)}\n\nCSV candidates:\n${context}\n\nBest countries summary:\n${bestCountries
              .map((c) => `${c.country} (${c.count} matches, avg score ${c.avgScore.toFixed(1)}%)`)
              .join("\n")}`,
          },
        ],
      }),
    });

    if (completion.ok) {
      const data = (await completion.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const answer = data.choices?.[0]?.message?.content?.trim();
      return NextResponse.json({
        answer: [gotItLine, answer || "I found some strong matches from the CSV data.", updatedLine]
          .filter(Boolean)
          .join("\n"),
        recommendations: recommendationIds,
        filterSummary: summarizeFilters(filters),
      });
    }
  }

  const topLines = shortlist.slice(0, filters.topN).map((uni, index) => {
    return `${index + 1}. ${uni.name} (${uni.countryName}) - ${uni.ranking}, ${uni.tuition}`;
  });

  const fallbackAnswer = shortlist.length
    ? [
        `I found ${shortlist.length} CSV matches.`,
        bestCountries.length ? `Top countries: ${bestCountries.map((item) => item.country).join(", ")}.` : "",
        topLines.length ? `Best options:\n${topLines.join("\n")}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    : "I could not find a good match in your CSV data for that request. Try specifying country, course, or budget.";

  return NextResponse.json({
    answer: [gotItLine, fallbackAnswer, updatedLine].filter(Boolean).join("\n"),
    recommendations: recommendationIds,
    filterSummary: summarizeFilters(filters),
  });
}
