import { NextRequest, NextResponse } from "next/server";
import { getUniversities } from "@/lib/csv-universities";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const toAmount = (raw: string, hasK: boolean) => {
  const value = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  return hasK ? value * 1000 : value;
};

const parseBudgetMax = (text: string) => {
  const match = text.match(/(?:under|below|less than|max|upto|up to)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  if (!match) return null;
  return toAmount(match[1], Boolean(match[2]));
};

const parseTuition = (tuition: string) => {
  const match = tuition.match(/\$([\d,]+)/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1].replace(/,/g, ""));
};

const rankFromText = (ranking: string) => {
  const match = ranking.match(/\d+/);
  return match ? Number(match[0]) : 9999;
};

const tokenize = (text: string) =>
  normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string; history?: ChatTurn[] };
  const message = (body.message || "").trim();
  if (!message) {
    return NextResponse.json({ answer: "Ask a question first.", recommendations: [] });
  }

  const universities = await getUniversities();
  const query = normalize(message);
  const tokens = tokenize(message);
  const budgetMax = parseBudgetMax(message);
  const wantsCountryRanking = /(best country|which country|top country|countries for)/i.test(message);

  const codeSet = new Set(universities.map((uni) => uni.countryCode));
  const countryCodesFromText = Array.from(new Set((message.match(/\b[A-Z]{2}\b/g) || []).map((item) => item.toUpperCase()))).filter(
    (code) => codeSet.has(code),
  );
  const countryNames = Array.from(new Set(universities.map((uni) => uni.countryName)));
  const matchedCountries = countryNames.filter((name) => new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(message));
  const matchedCountryCodes = new Set([
    ...countryCodesFromText,
    ...matchedCountries
      .map((name) => universities.find((uni) => uni.countryName === name)?.countryCode)
      .filter((value): value is string => Boolean(value)),
  ]);

  const knownCourses = Array.from(new Set(universities.flatMap((uni) => uni.courses)));
  const aliases: Record<string, string[]> = {
    cs: ["computer science"],
    ai: ["artificial intelligence", "data science", "machine learning"],
    mba: ["business", "management", "accounting & finance"],
    medicine: ["medicine", "biological sciences", "veterinary science"],
  };
  const matchedCourses = knownCourses.filter((course) => {
    const courseNorm = normalize(course);
    if (query.includes(courseNorm)) return true;
    return Object.entries(aliases).some(([alias, expansions]) => {
      if (!new RegExp(`\\b${alias}\\b`, "i").test(query)) return false;
      return expansions.some((item) => courseNorm.includes(item));
    });
  });

  const scored = universities
    .map((uni) => {
      if (matchedCountryCodes.size && !matchedCountryCodes.has(uni.countryCode)) {
        return { uni, score: Number.NEGATIVE_INFINITY };
      }

      if (matchedCourses.length) {
        const uniCourseNorm = uni.courses.map((course) => normalize(course)).join(" ");
        const hit = matchedCourses.some((course) => uniCourseNorm.includes(normalize(course)));
        if (!hit) return { uni, score: Number.NEGATIVE_INFINITY };
      }

      const tuition = parseTuition(uni.tuition);
      if (budgetMax !== null && tuition > budgetMax) {
        return { uni, score: Number.NEGATIVE_INFINITY };
      }

      const haystack = `${uni.name} ${uni.countryName} ${uni.countryCode} ${uni.courses.join(" ")} ${uni.description}`.toLowerCase();
      const tokenHits = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0);
      const rankBonus = Math.max(0, 200 - rankFromText(uni.ranking)) / 40;
      const scoreBonus = uni.score / 100;
      return { uni, score: tokenHits * 2 + rankBonus + scoreBonus };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const shortlist = scored.slice(0, 20).map((item) => item.uni);
  const recommendationIds = shortlist.slice(0, 5).map((uni) => uni.id);

  if (wantsCountryRanking && shortlist.length) {
    const byCountry = new Map<string, { name: string; count: number; avg: number }>();
    for (const uni of shortlist) {
      const current = byCountry.get(uni.countryCode);
      if (current) {
        current.count += 1;
        current.avg += uni.score;
      } else {
        byCountry.set(uni.countryCode, { name: uni.countryName, count: 1, avg: uni.score });
      }
    }
    const topCountries = Array.from(byCountry.values())
      .map((item) => ({ ...item, avg: item.avg / item.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);

    const answer = topCountries.length
      ? `Top countries from your CSV:\n${topCountries
          .map((item, index) => `${index + 1}. ${item.name} (${item.count} matches, avg score ${item.avg.toFixed(1)}%)`)
          .join("\n")}`
      : "No country-level match found in CSV for that query.";

    return NextResponse.json({ answer, recommendations: recommendationIds });
  }

  if (!shortlist.length) {
    return NextResponse.json({
      answer: "No strong match found in CSV. Try adding country, course, or budget.",
      recommendations: [],
    });
  }

  const answer = `Found ${shortlist.length} relevant universities from CSV. Showing top ${Math.min(5, shortlist.length)}.`;
  return NextResponse.json({ answer, recommendations: recommendationIds });
}
