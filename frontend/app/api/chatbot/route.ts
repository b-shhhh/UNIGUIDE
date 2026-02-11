import { NextRequest, NextResponse } from "next/server";
import { getUniversities } from "@/lib/csv-universities";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  recommendationIds?: string[];
};

type ExtractedFilters = {
  country?: string;
  course?: string;
  budget?: number | string;
  min_ielts?: number;
  min_gpa?: number;
  intake?: string;
  mode?: "online" | "offline" | "both";
};

const normalize = (value: string) => value.trim().toLowerCase();

const tokenize = (text: string) =>
  normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const isGreetingOnly = (text: string) =>
  /^(hi|hello|hey|good morning|goodmorning|good afternoon|goodafternoon|good evening|goodevening)[!. ]*$/i.test(
    text.trim(),
  );

const rankFromText = (ranking: string) => {
  const match = ranking.match(/\d+/);
  return match ? Number(match[0]) : 9999;
};

const parseTuition = (tuition: string) => {
  const match = tuition.match(/\$([\d,]+)/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1].replace(/,/g, ""));
};

const parseBudget = (text: string): number | string | undefined => {
  const t = normalize(text);
  if (/(affordable|cheap|low tuition|low budget)/.test(t)) {
    return "low";
  }

  const range = t.match(/(?:between)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?\s*(?:and|-)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  if (range) {
    const low = Number(range[1].replace(/,/g, "")) * (range[2] ? 1000 : 1);
    const high = Number(range[3].replace(/,/g, "")) * (range[4] ? 1000 : 1);
    if (Number.isFinite(low) && Number.isFinite(high)) return `${low}-${high}`;
  }

  const under = t.match(/(?:under|below|less than|max|upto|up to)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  if (under) {
    const max = Number(under[1].replace(/,/g, "")) * (under[2] ? 1000 : 1);
    if (Number.isFinite(max)) return `<${max}`;
  }

  const exact = t.match(/\$\s*(\d+(?:[.,]\d+)?)/);
  if (exact) {
    const val = Number(exact[1].replace(/,/g, ""));
    if (Number.isFinite(val)) return val;
  }

  return undefined;
};

const getBudgetMax = (budget?: number | string) => {
  if (typeof budget === "number") return budget;
  if (!budget) return null;
  if (budget === "low") return 15000;
  if (budget.startsWith("<")) {
    const val = Number(budget.slice(1));
    return Number.isFinite(val) ? val : null;
  }
  if (budget.includes("-")) {
    const [low, high] = budget.split("-").map((v) => Number(v));
    if (Number.isFinite(high)) return high;
    if (Number.isFinite(low)) return low;
  }
  return null;
};

const askOpenAI = async ({
  message,
  history,
  context,
  filters,
  universityMode,
}: {
  message: string;
  history: ChatTurn[];
  context: string;
  filters: ExtractedFilters;
  universityMode: boolean;
}) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: universityMode
            ? "You are a university advisor chatbot. Use the provided university context for recommendation answers. If data is missing, say so briefly. Be concise and practical."
            : "You are a helpful chatbot. Answer naturally and clearly.",
        },
        ...history.map((turn) => ({
          role: turn.role,
          content: turn.content,
        })),
        {
          role: "user",
          content: universityMode
            ? `User query: ${message}\n\nExtracted filters:\n${JSON.stringify(
                filters,
                null,
                2,
              )}\n\nUniversity context:\n${context}`
            : `User query: ${message}`,
        },
      ],
    }),
  });

  if (!completion.ok) {
    return null;
  }

  const data = (await completion.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const answer = data.choices?.[0]?.message?.content?.trim();
  return answer || null;
};

const extractFilters = (message: string, countryNames: string[], courses: string[]): ExtractedFilters => {
  const text = normalize(message);

  const countryAliases: Record<string, string> = {
    uk: "United Kingdom",
    usa: "United States",
    us: "United States",
    uae: "United Arab Emirates",
  };

  let country: string | undefined;
  for (const name of countryNames) {
    if (new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(message)) {
      country = name;
      break;
    }
  }

  if (!country) {
    for (const [alias, mapped] of Object.entries(countryAliases)) {
      if (new RegExp(`\\b${alias}\\b`, "i").test(text)) {
        country = mapped;
        break;
      }
    }
  }

  const aliases: Record<string, string[]> = {
    cs: ["computer science"],
    mba: ["business", "management", "accounting"],
    ai: ["artificial intelligence", "data science", "machine learning"],
    medicine: ["medicine", "biological sciences", "veterinary science"],
    engineering: ["engineering", "mechanical", "civil", "electrical"],
  };

  let course: string | undefined;
  for (const candidate of courses) {
    if (text.includes(normalize(candidate))) {
      course = candidate;
      break;
    }
  }

  if (!course) {
    for (const [alias, options] of Object.entries(aliases)) {
      if (!new RegExp(`\\b${alias}\\b`, "i").test(text)) continue;
      const picked = courses.find((courseName) => options.some((option) => normalize(courseName).includes(option)));
      if (picked) {
        course = picked;
        break;
      }
      course = options[0];
      break;
    }
  }

  const ieltsMatch = message.match(/ielts\s*(?:score)?\s*(\d(?:\.\d)?)/i);
  const gpaMatch = message.match(/gpa\s*(?:score)?\s*(\d(?:\.\d+)?)/i);
  const intakeMatch = message.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|spring|fall|autumn|summer|\d{4})\b/i,
  );

  let mode: "online" | "offline" | "both" | undefined;
  if (/\bonline\b/i.test(message)) mode = "online";
  if (/\boffline\b|on-campus|on campus/i.test(message)) mode = "offline";
  if (/\bboth\b|hybrid/i.test(message)) mode = "both";

  return {
    country,
    course,
    budget: parseBudget(message),
    min_ielts: ieltsMatch ? Number(ieltsMatch[1]) : undefined,
    min_gpa: gpaMatch ? Number(gpaMatch[1]) : undefined,
    intake: intakeMatch ? intakeMatch[1] : undefined,
    mode,
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string; history?: ChatTurn[] };
  const message = String(body.message || "").trim();
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  if (!message) {
    return NextResponse.json({ answer: "Ask a question first.", recommendations: [], filters: {} });
  }

  if (isGreetingOnly(message)) {
    const normalizedMessage = normalize(message);
    if (normalizedMessage.startsWith("good morning") || normalizedMessage.startsWith("goodmorning")) {
      return NextResponse.json({ answer: "Good morning!", recommendations: [], filters: {} });
    }
    if (normalizedMessage.startsWith("good afternoon") || normalizedMessage.startsWith("goodafternoon")) {
      return NextResponse.json({ answer: "Good afternoon!", recommendations: [], filters: {} });
    }
    if (normalizedMessage.startsWith("good evening") || normalizedMessage.startsWith("goodevening")) {
      return NextResponse.json({ answer: "Good evening!", recommendations: [], filters: {} });
    }
    return NextResponse.json({ answer: "Hi!", recommendations: [], filters: {} });
  }

  const universities = await getUniversities();
  const countryNames = Array.from(new Set(universities.map((uni) => uni.countryName)));
  const knownCourses = Array.from(new Set(universities.flatMap((uni) => uni.courses)));
  const filters = extractFilters(message, countryNames, knownCourses);
  const normalizedMessage = normalize(message);
  const countryOnlyIntent =
    (/\bcountry\b/.test(normalizedMessage) || Boolean(filters.country)) &&
    !filters.course &&
    !filters.budget &&
    filters.min_ielts === undefined &&
    filters.min_gpa === undefined &&
    !filters.intake &&
    !filters.mode &&
    !/\b(university|universities|college|colleges)\b/.test(normalizedMessage);

  if (countryOnlyIntent) {
    if (filters.country) {
      return NextResponse.json({
        answer: `Country: ${filters.country}`,
        recommendations: [],
        filters,
      });
    }

    const topCountries = Array.from(
      universities.reduce<Map<string, number>>((acc, uni) => {
        acc.set(uni.countryName, (acc.get(uni.countryName) || 0) + 1);
        return acc;
      }, new Map()),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count], index) => `${index + 1}. ${name} (${count})`)
      .join("\n");

    return NextResponse.json({
      answer: `Countries:\n${topCountries}`,
      recommendations: [],
      filters,
    });
  }

  const courseOnlyIntent =
    (/\bcourse\b|\bcourses\b|\bsubject\b|\bsubjects\b/.test(normalizedMessage) || Boolean(filters.course)) &&
    !filters.country &&
    !filters.budget &&
    filters.min_ielts === undefined &&
    filters.min_gpa === undefined &&
    !filters.intake &&
    !filters.mode &&
    !/\b(university|universities|college|colleges)\b/.test(normalizedMessage);

  if (courseOnlyIntent) {
    if (filters.course) {
      return NextResponse.json({
        answer: `Course: ${filters.course}`,
        recommendations: [],
        filters,
      });
    }

    const topCourses = Array.from(
      universities.reduce<Map<string, number>>((acc, uni) => {
        for (const course of uni.courses) {
          acc.set(course, (acc.get(course) || 0) + 1);
        }
        return acc;
      }, new Map()),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name]) => name)
      .join(", ");

    return NextResponse.json({
      answer: `Courses: ${topCourses}`,
      recommendations: [],
      filters,
    });
  }
  const universityIntent =
    /(university|universities|college|study|course|program|tuition|ielts|gpa|intake|admission|scholarship|major|best country|which country|cs|mba|engineering|medicine|law)/i.test(
      message,
    ) ||
    Boolean(filters.country || filters.course || filters.budget || filters.min_ielts || filters.min_gpa || filters.intake || filters.mode);

  if (!universityIntent) {
    const generalAnswer =
      (await askOpenAI({
        message,
        history,
        context: "",
        filters: {},
        universityMode: false,
      })) || "Sure. Ask me anything, and if you want university guidance, tell me country/course/budget.";

    return NextResponse.json({
      answer: generalAnswer,
      recommendations: [],
      filters: {},
    });
  }

  const budgetMax = getBudgetMax(filters.budget);
  const followPrevious = /(best among these|among these|among them|from these|which one)/i.test(message);

  const previousIds = history.flatMap((turn) => turn.recommendationIds || []);
  const previousSet = new Set(previousIds);

  const tokens = tokenize(message);
  const scored = universities
    .map((uni) => {
      if (followPrevious && previousSet.size > 0 && !previousSet.has(uni.id)) {
        return { uni, score: Number.NEGATIVE_INFINITY };
      }

      if (filters.country && normalize(uni.countryName) !== normalize(filters.country)) {
        return { uni, score: Number.NEGATIVE_INFINITY };
      }

      if (filters.course) {
        const uniCourses = uni.courses.map((course) => normalize(course)).join(" ");
        const target = normalize(filters.course);
        if (!uniCourses.includes(target)) {
          return { uni, score: Number.NEGATIVE_INFINITY };
        }
      }

      if (budgetMax !== null && parseTuition(uni.tuition) > budgetMax) {
        return { uni, score: Number.NEGATIVE_INFINITY };
      }

      const haystack = `${uni.name} ${uni.countryName} ${uni.countryCode} ${uni.courses.join(" ")} ${uni.description}`.toLowerCase();
      const tokenHits = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0);
      const rankBonus = Math.max(0, 200 - rankFromText(uni.ranking)) / 30;
      const scoreBonus = uni.score / 100;
      const tuitionBonus = Math.max(0, 60000 - parseTuition(uni.tuition)) / 60000;
      return { uni, score: tokenHits * 2 + rankBonus + scoreBonus + tuitionBonus };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const recommendations = scored.slice(0, 5).map((item) => item.uni.id);
  const topUniversities = scored.slice(0, 10).map((item) => item.uni);
  const context = topUniversities
    .map(
      (uni) =>
        `${uni.name} | ${uni.countryName} | courses: ${uni.courses.join(", ")} | ${uni.ranking} | ${uni.tuition} | score ${uni.score}%`,
    )
    .join("\n");

  if (!scored.length) {
    return NextResponse.json({
      answer: "I could not find a strong match. Try adding country, course, or budget.",
      recommendations: [],
      filters,
    });
  }

  const countryQuestion = /(best country|which country|top countries|country is best)/i.test(message);
  if (countryQuestion) {
    const topCountries = new Map<string, { name: string; count: number; avgScore: number }>();
    for (const item of scored.slice(0, 25)) {
      const current = topCountries.get(item.uni.countryCode);
      if (current) {
        current.count += 1;
        current.avgScore += item.uni.score;
      } else {
        topCountries.set(item.uni.countryCode, {
          name: item.uni.countryName,
          count: 1,
          avgScore: item.uni.score,
        });
      }
    }

    const rankedCountries = Array.from(topCountries.values())
      .map((entry) => ({ ...entry, avgScore: entry.avgScore / entry.count }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    const answer = `Top countries:\n${rankedCountries
      .map((entry, index) => `${index + 1}. ${entry.name} (${entry.count} matches)`)
      .join("\n")}`;

    const openAiAnswer = await askOpenAI({
      message,
      history,
      context:
        context +
        `\n\nCountry summary:\n${rankedCountries
          .map((entry, index) => `${index + 1}. ${entry.name} (${entry.count} matches)`)
          .join("\n")}`,
      filters,
      universityMode: true,
    });

    return NextResponse.json({ answer: openAiAnswer || answer, recommendations: [], filters });
  }

  const fallbackAnswer = `I found ${scored.length} matches. Here are the best options for your query.`;
  const openAiAnswer = await askOpenAI({
    message,
    history,
    context,
    filters,
    universityMode: true,
  });

  return NextResponse.json({
    answer: openAiAnswer || fallbackAnswer,
    recommendations,
    filters,
  });
}
