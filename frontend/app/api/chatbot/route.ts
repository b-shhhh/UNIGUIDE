import { NextRequest, NextResponse } from "next/server";
import { getUniversities } from "@/lib/csv-universities";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const parseBudget = (text: string) => {
  const match = text.match(/(?:under|below|less than|max(?:imum)?)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
  if (!match) {
    return null;
  }
  const amount = Number(match[1].replace(",", ""));
  if (!Number.isFinite(amount)) {
    return null;
  }
  return match[2] ? amount * 1000 : amount;
};

const parseTuition = (tuition: string) => {
  const match = tuition.match(/\$([\d,]+)/);
  if (!match) {
    return Number.POSITIVE_INFINITY;
  }
  return Number(match[1].replace(/,/g, ""));
};

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);

const rankFromText = (ranking: string) => {
  const match = ranking.match(/\d+/);
  return match ? Number(match[0]) : 9999;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string; history?: ChatTurn[] };
  const message = (body.message || "").trim();
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  if (!message) {
    return NextResponse.json({ answer: "Ask a question first.", recommendations: [] });
  }

  const universities = await getUniversities();
  const tokens = tokenize(message);
  const budget = parseBudget(message);

  const scored = universities
    .map((uni) => {
      const haystack = `${uni.name} ${uni.countryName} ${uni.course} ${uni.description}`.toLowerCase();
      const tokenScore = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0);
      const budgetScore = budget !== null && parseTuition(uni.tuition) <= budget ? 2 : 0;
      const qualityScore = Math.max(0, 120 - rankFromText(uni.ranking)) / 50 + uni.score / 100;
      return { uni, score: tokenScore + budgetScore + qualityScore };
    })
    .sort((a, b) => b.score - a.score);

  let candidates = scored.map((item) => item.uni).slice(0, 25);
  if (budget !== null) {
    const budgetMatches = candidates.filter((uni) => parseTuition(uni.tuition) <= budget);
    if (budgetMatches.length) {
      candidates = budgetMatches;
    }
  }

  const bestCountries = Object.values(
    candidates.reduce<Record<string, { country: string; count: number; avgScore: number }>>((acc, uni) => {
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

  const recommendationIds = candidates
    .sort((a, b) => rankFromText(a.ranking) - rankFromText(b.ranking))
    .slice(0, 5)
    .map((item) => item.id);

  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    const context = candidates
      .slice(0, 20)
      .map(
        (u) =>
          `${u.id} | ${u.name} | ${u.countryName} | ${u.course} | ${u.tuition} | ${u.ranking} | score ${u.score}%`,
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
              "You are UniGuide assistant. Answer naturally like a chatbot, but only use provided university CSV context. If uncertain, say so briefly. Keep answers concise.",
          },
          ...history.map((turn) => ({ role: turn.role, content: turn.content })),
          {
            role: "user",
            content: `User question: ${message}\n\nCSV candidates:\n${context}\n\nBest countries summary:\n${bestCountries
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
        answer: answer || "I found some strong matches from the CSV data.",
        recommendations: recommendationIds,
      });
    }
  }

  const fallbackAnswer = `Based on CSV data, I found ${candidates.length} relevant matches. Top countries: ${bestCountries
    .map((item) => item.country)
    .join(", ")}.`;
  return NextResponse.json({
    answer: fallbackAnswer,
    recommendations: recommendationIds,
  });
}

