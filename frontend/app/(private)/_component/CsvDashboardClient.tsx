"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import type { CountrySummary, CourseSummary, CsvUniversity } from "@/lib/csv-universities";
import { fetchSavedUniversityIds, SAVED_UNIVERSITIES_UPDATE_EVENT, toggleUniversitySaved } from "@/lib/saved-universities";

type Props = {
  universities: CsvUniversity[];
  countries: CountrySummary[];
  courses: CourseSummary[];
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  results?: CsvUniversity[];
  countryResults?: {
    code: string;
    name: string;
    flagImageUrl: string;
    averageScore: number;
    count: number;
    bestUniversity: CsvUniversity;
  }[];
};

type ChatContext = {
  courseSlug: string | null;
  countryCode: string | null;
  budgetLimit: number | null;
  lastUniversityResults: CsvUniversity[];
  lastCountryResults: {
    code: string;
    name: string;
    flagImageUrl: string;
    averageScore: number;
    count: number;
    bestUniversity: CsvUniversity;
  }[];
};

export default function CsvDashboardClient({ universities, countries, courses }: Props) {
  const [query, setQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi, ask me for universities by country, course, and budget. Example: affordable universities in Canada for Computer Science under $15k.",
    },
  ]);
  const [chatContext, setChatContext] = useState<ChatContext>({
    courseSlug: null,
    countryCode: null,
    budgetLimit: null,
    lastUniversityResults: [],
    lastCountryResults: [],
  });
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const syncSaved = async () => {
      const ids = await fetchSavedUniversityIds();
      if (active) {
        setSavedIds(ids);
      }
    };

    void syncSaved();
    window.addEventListener("storage", syncSaved);
    window.addEventListener(SAVED_UNIVERSITIES_UPDATE_EVENT, syncSaved);
    return () => {
      active = false;
      window.removeEventListener("storage", syncSaved);
      window.removeEventListener(SAVED_UNIVERSITIES_UPDATE_EVENT, syncSaved);
    };
  }, []);

  const filteredUniversities = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return universities;
    }
    return universities.filter((uni) => `${uni.name} ${uni.countryName} ${uni.course}`.toLowerCase().includes(needle));
  }, [query, universities]);

  const topRankedUniversities = useMemo(() => {
    const readRank = (ranking: string) => {
      const match = ranking.match(/\d+/);
      return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
    };

    return [...filteredUniversities]
      .sort((a, b) => readRank(a.ranking) - readRank(b.ranking))
      .slice(0, 3);
  }, [filteredUniversities]);

  const onToggleSaved = async (id: string) => {
    setSavingId(id);
    const result = await toggleUniversitySaved(id);
    setSavedIds(result.ids);
    setSavingId(null);
  };

  const parseBudget = (text: string) => {
    const match = text.match(/(?:under|below|less than)\s*\$?\s*(\d+(?:[.,]\d+)?)\s*(k)?/i);
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

  const handleChatAsk = () => {
    const raw = chatInput.trim();
    const prompt = raw.toLowerCase();
    if (!prompt) {
      return;
    }

    setChatInput("");

    const courseAliases: Record<string, string> = {
      cs: "computer-science",
      "computer science": "computer-science",
      ai: "artificial-intelligence",
      "data science": "data-science",
      cybersecurity: "cyber-security",
      "software engineering": "software-engineering",
    };

    const matchedCountry = countries.find((country) => prompt.includes(country.name.toLowerCase()));
    const detectedCourse =
      courses.find((course) => prompt.includes(course.name.toLowerCase())) ??
      courses.find((course) =>
        Object.entries(courseAliases).some(([alias, slug]) => prompt.includes(alias) && slug === course.slug),
      );
    const budgetLimit = parseBudget(prompt);
    const followupBestAmong =
      prompt.includes("best among these") || prompt.includes("best one") || prompt.includes("which is best");
    const askBestCountries =
      prompt.includes("best country") || prompt.includes("best countries") || prompt.includes("top countries");

    const effectiveCountry = matchedCountry?.code ?? chatContext.countryCode;
    const effectiveCourse = detectedCourse?.slug ?? chatContext.courseSlug;
    const effectiveBudget = budgetLimit ?? chatContext.budgetLimit;

    if (followupBestAmong) {
      if (chatContext.lastCountryResults.length) {
        const bestCountry = chatContext.lastCountryResults[0];
        const assistantText = `Best among those is ${bestCountry.name}. Top university there from your last request is ${bestCountry.bestUniversity.name}.`;
        setChatMessages((prev) => [
          ...prev,
          { role: "user", text: raw },
          {
            role: "assistant",
            text: assistantText,
            results: [bestCountry.bestUniversity],
            countryResults: [bestCountry],
          },
        ]);
        return;
      }
      if (chatContext.lastUniversityResults.length) {
        const bestUni = chatContext.lastUniversityResults[0];
        const assistantText = `Best among those is ${bestUni.name} in ${bestUni.countryName}.`;
        setChatMessages((prev) => [
          ...prev,
          { role: "user", text: raw },
          { role: "assistant", text: assistantText, results: [bestUni] },
        ]);
        return;
      }
    }

    const scoped = universities.filter((uni) => {
      const byCountry = effectiveCountry ? uni.countryCode === effectiveCountry : true;
      const byCourse = effectiveCourse ? uni.courseSlug === effectiveCourse : true;
      const byBudget = effectiveBudget !== null ? parseTuition(uni.tuition) <= effectiveBudget : true;
      return byCountry && byCourse && byBudget;
    });

    if (askBestCountries) {
      const grouped = new Map<
        string,
        { code: string; name: string; flagImageUrl: string; totalScore: number; count: number; bestUniversity: CsvUniversity }
      >();

      for (const uni of scoped) {
        const current = grouped.get(uni.countryCode);
        if (!current) {
          grouped.set(uni.countryCode, {
            code: uni.countryCode,
            name: uni.countryName,
            flagImageUrl: uni.countryFlagUrl,
            totalScore: uni.score,
            count: 1,
            bestUniversity: uni,
          });
          continue;
        }
        current.totalScore += uni.score;
        current.count += 1;
        if (uni.score > current.bestUniversity.score) {
          current.bestUniversity = uni;
        }
      }

      const countryResults = Array.from(grouped.values())
        .map((item) => ({
          code: item.code,
          name: item.name,
          flagImageUrl: item.flagImageUrl,
          averageScore: item.totalScore / item.count,
          count: item.count,
          bestUniversity: item.bestUniversity,
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5);

      const assistantText = countryResults.length
        ? `Top ${countryResults.length} countries${effectiveCourse ? ` for ${courses.find((c) => c.slug === effectiveCourse)?.name || "your course"}` : ""} are listed below.`
        : "I found no country match for this request.";

      setChatContext({
        courseSlug: effectiveCourse,
        countryCode: effectiveCountry,
        budgetLimit: effectiveBudget,
        lastUniversityResults: countryResults.map((c) => c.bestUniversity),
        lastCountryResults: countryResults,
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "user", text: raw },
        { role: "assistant", text: assistantText, countryResults: countryResults.length ? countryResults : undefined },
      ]);
      return;
    }

    const results = scoped.sort((a, b) => b.score - a.score).slice(0, 5);

    let assistantText = "";
    if (!matchedCountry && !detectedCourse && budgetLimit === null && !chatContext.courseSlug && !chatContext.countryCode) {
      assistantText =
        "I can help better if you include at least one of: country, course, or budget. Example: universities in Canada for Data Science under $20k.";
    } else if (!results.length) {
      assistantText = "I found no exact match. Try increasing budget or changing course/country.";
    } else {
      assistantText = `I found ${results.length} match${results.length > 1 ? "es" : ""}${effectiveCountry ? ` in ${countries.find((c) => c.code === effectiveCountry)?.name || ""}` : ""}${effectiveCourse ? ` for ${courses.find((c) => c.slug === effectiveCourse)?.name || "selected course"}` : ""}${effectiveBudget ? ` under $${effectiveBudget.toLocaleString()}` : ""}.`;
    }

    setChatContext((prev) => ({
      ...prev,
      courseSlug: effectiveCourse,
      countryCode: effectiveCountry,
      budgetLimit: effectiveBudget,
      lastUniversityResults: results,
      lastCountryResults: [],
    }));
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: raw },
      { role: "assistant", text: assistantText, results: results.length ? results : undefined },
    ]);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#4A90E2]/20 bg-[linear-gradient(120deg,#4A90E2_0%,#357ABD_100%)] p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e9f2ff]">Dashboard</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Search universities from CSV data</h2>
        <p className="mt-2 text-sm text-white/90">Search engine, countries, courses, and university detail pages.</p>

        <div className="mt-5">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by university, course, or country..."
            className="h-11 w-full rounded-lg border border-white/50 bg-white px-3 text-sm text-[#1a2b44] outline-none"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-4">
        <h3 className="text-lg font-bold text-[#1a2b44]">AI Chatbot (CSV)</h3>
        <p className="mt-1 text-xs text-[#5f7590]">Try: affordable universities in Canada for Computer Science under $15k</p>

        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-[#d8e5f8] bg-[#f8fbff] p-3">
          {chatMessages.map((message, index) => (
            <div key={`chat-msg-${index}`} className={message.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block max-w-[90%] rounded-lg px-3 py-2 text-xs ${
                  message.role === "user" ? "bg-[#4A90E2] text-white" : "border border-[#d8e5f8] bg-white text-[#1a2b44]"
                }`}
              >
                {message.text}
              </div>
              {message.role === "assistant" && message.results?.length ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {message.results.map((uni) => (
                    <Link
                      key={`chat-${uni.id}`}
                      href={`/homepage/universities/${uni.id}`}
                      className="rounded-md border border-[#d8e5f8] bg-white px-3 py-2 text-left hover:bg-[#f5f9ff]"
                    >
                      <p className="text-xs font-semibold text-[#1a2b44]">{uni.name}</p>
                      <p className="text-[11px] text-[#5f7590]">
                        {uni.countryName} - {uni.course}
                      </p>
                      <p className="text-[11px] text-[#5f7590]">{uni.tuition}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
              {message.role === "assistant" && message.countryResults?.length ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {message.countryResults.map((country) => (
                    <Link
                      key={`chat-country-${country.code}`}
                      href={`/homepage/countries/${country.code}`}
                      className="rounded-md border border-[#d8e5f8] bg-white px-3 py-2 text-left hover:bg-[#f5f9ff]"
                    >
                      <p className="text-xs font-semibold text-[#1a2b44]">
                        {country.flagImageUrl ? (
                          <img
                            src={country.flagImageUrl}
                            alt={`${country.name} flag`}
                            width={14}
                            height={10}
                            className="mr-1 inline rounded-[2px] align-[-2px]"
                          />
                        ) : null}
                        {country.name}
                      </p>
                      <p className="text-[11px] text-[#5f7590]">Avg score: {country.averageScore.toFixed(1)}%</p>
                      <p className="text-[11px] text-[#5f7590]">Matches: {country.count}</p>
                      <p className="text-[11px] text-[#5f7590]">Best uni: {country.bestUniversity.name}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleChatAsk();
              }
            }}
            placeholder="Ask your query..."
            className="h-10 w-full rounded-md border border-[#d8e5f8] px-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleChatAsk}
            className="h-10 rounded-md bg-[#4A90E2] px-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Ask
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="h-fit self-start rounded-2xl border border-[#d8e5f8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Countries</h3>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">{countries.length} total</p>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {countries.slice(0, 12).map((country) => (
              <Link
                key={country.code}
                href={`/homepage/countries/${country.code}`}
                className="flex min-w-[108px] items-center justify-between rounded-md border border-[#d8e5f8] px-1.5 py-1 hover:bg-[#f5f9ff]"
              >
                <span className="truncate text-[11px] font-semibold text-[#1a2b44]">
                  {country.flagImageUrl ? (
                    <img
                      src={country.flagImageUrl}
                      alt={`${country.name} flag`}
                      width={12}
                      height={9}
                      className="mr-1 inline rounded-[2px] align-[-2px]"
                    />
                  ) : null}
                  {country.name}
                </span>
                <span className="text-[10px] font-bold text-[#5f7590]">{country.count}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="h-fit self-start rounded-2xl border border-[#d8e5f8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Courses</h3>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">{courses.length} total</p>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {courses.slice(0, 12).map((course) => (
              <Link
                key={course.slug}
                href={`/homepage/courses/${course.slug}`}
                className="min-w-[150px] rounded-md border border-[#d8e5f8] px-2 py-1 hover:bg-[#f5f9ff]"
              >
                <p className="truncate text-[11px] font-semibold text-[#1a2b44]">{course.name}</p>
                <p className="text-[10px] text-[#5f7590]">{course.count} unis</p>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1a2b44]">University Cards</h3>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">
            Showing {topRankedUniversities.length} of {filteredUniversities.length}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {topRankedUniversities.map((uni) => {
            const saved = savedIds.includes(uni.id);
            return (
              <article key={uni.id} className="rounded-xl border border-[#d8e5f8] bg-[#fcfeff] p-4">
                {uni.logoUrl ? (
                  <img src={uni.logoUrl} alt={`${uni.name} logo`} width={34} height={34} className="mb-2 rounded" />
                ) : null}
                <p className="text-base font-bold text-[#1a2b44]">{uni.name}</p>
                <p className="mt-1 text-xs text-[#5f7590]">
                  {uni.countryFlagUrl ? (
                    <img
                      src={uni.countryFlagUrl}
                      alt={`${uni.countryName} flag`}
                      width={16}
                      height={12}
                      className="mr-1 inline rounded-[2px] align-[-2px]"
                    />
                  ) : null}
                  {uni.countryName}
                </p>
                <p className="mt-1 text-xs text-[#5f7590]">{uni.course}</p>
                <p className="mt-1 text-xs text-[#5f7590]">{uni.ranking}</p>
                <p className="mt-1 text-xs text-[#0f766e]">AI score: {uni.score}%</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/homepage/universities/${uni.id}`}
                    className="rounded-lg bg-[#4A90E2] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD]"
                  >
                    View Detail
                  </Link>
                  <button
                    type="button"
                    disabled={savingId === uni.id}
                    onClick={() => onToggleSaved(uni.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${
                      saved ? "bg-[#fee2e2] text-[#b91c1c]" : "bg-[#dbeafe] text-[#1d4ed8]"
                    }`}
                  >
                    {saved ? "Unsave" : "Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
