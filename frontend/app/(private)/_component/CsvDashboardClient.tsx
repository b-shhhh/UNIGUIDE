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
};

export default function CsvDashboardClient({ universities, countries, courses }: Props) {
  const [query, setQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Tell me what you want to study and I'll find universities for you.",
    },
  ]);
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

  const handleChatAsk = async () => {
    const raw = chatInput.trim();
    if (!raw || chatLoading) {
      return;
    }

    setChatInput("");
    const nextMessages = [...chatMessages, { role: "user" as const, text: raw }];
    setChatMessages(nextMessages);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: raw,
          history: nextMessages.map((msg) => ({
            role: msg.role,
            content: msg.text,
            recommendationIds: msg.results?.map((uni) => uni.id) || [],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const payload = (await response.json()) as {
        answer?: string;
        recommendations?: string[];
      };

      const recommended = (payload.recommendations || [])
        .map((id) => universities.find((uni) => uni.id === id))
        .filter((item): item is CsvUniversity => Boolean(item));

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: payload.answer || "I found some useful matches from your CSV.",
          results: recommended.length ? recommended : undefined,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not process that right now. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
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
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/homepage/courses/${course.slug}`}
                className="min-w-[220px] rounded-md border border-[#d8e5f8] px-2 py-1.5 hover:bg-[#f5f9ff]"
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

      <button
        type="button"
        onClick={() => setChatOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[#4A90E2] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-lg hover:bg-[#357ABD]"
      >
        {chatOpen ? "Close Bot" : "AI Bot"}
      </button>

      {chatOpen ? (
        <section className="fixed bottom-20 right-5 z-40 w-[min(92vw,390px)] rounded-2xl border border-[#d8e5f8] bg-white p-4 shadow-2xl">
          <h3 className="text-lg font-bold text-[#1a2b44]">AI Chatbot (CSV)</h3>
          <p className="mt-1 text-xs text-[#5f7590]">
            Ask anything. It answers from your CSV only and supports follow-ups like "best among these".
          </p>

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
                  <div className="mt-2 grid gap-2">
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
              </div>
            ))}
            {chatLoading ? <p className="text-xs text-[#5f7590]">Assistant is thinking...</p> : null}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleChatAsk();
                }
              }}
              placeholder="Ask your query..."
              className="h-10 w-full rounded-md border border-[#d8e5f8] px-3 text-sm outline-none"
            />
            <button
              type="button"
              disabled={chatLoading}
              onClick={() => {
                void handleChatAsk();
              }}
              className="h-10 rounded-md bg-[#4A90E2] px-4 text-xs font-bold uppercase tracking-[0.08em] text-white disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
