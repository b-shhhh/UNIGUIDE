"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  results?: Array<{
    id: string;
    name: string;
    country: string;
    state?: string;
    city?: string;
    courses: string[];
    courseCategory?: string;
    degreeLevel?: string;
    ieltsMin?: number | null;
    satRequired?: boolean;
    satMin?: number | null;
    tuition: string;
    viewDetailsUrl: string;
  }>;
};

export default function DashboardChatbot() {
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Tell me what you want to study and I will find universities for you.",
    },
  ]);

  const handleChatAsk = async () => {
    const raw = chatInput.trim();
    if (!raw || chatLoading) return;

    const next = [...chatMessages, { role: "user" as const, text: raw }];
    setChatMessages(next);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: raw,
          history: next.map((msg) => ({
            role: msg.role,
            content: msg.text,
            recommendationIds: msg.results?.map((uni) => uni.id) || [],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to ask chatbot");
      }

      const payload = (await response.json()) as {
        answer?: string;
        results?: Array<{
          id: string;
          name: string;
          country: string;
          courses: string[];
          tuition: string;
          viewDetailsUrl: string;
        }>;
      };

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: payload.answer || "I found some matching universities for you.",
          results: payload.results?.length ? payload.results : undefined,
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
    <>
      <button
        type="button"
        onClick={() => setChatOpen((prev) => !prev)}
        aria-label={chatOpen ? "Close chatbot" : "Open chatbot"}
        title={chatOpen ? "Close chatbot" : "Open chatbot"}
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A90E2] text-sm font-bold uppercase text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#357ABD]"
      >
        AI
      </button>

      {chatOpen ? (
        <section className="fixed bottom-20 right-5 z-40 w-[min(92vw,390px)] rounded-2xl border border-[#d8e5f8] bg-white p-4 shadow-2xl">
          <h3 className="text-lg font-bold text-[#1a2b44]">AI Chatbot</h3>
          <p className="mt-1 text-xs text-[#5f7590]">Ask naturally. I will find matching universities for you.</p>

          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-[#d8e5f8] bg-[#f8fbff] p-3">
            {chatMessages.map((message, index) => (
              <div key={`chat-${index}`} className={message.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[90%] rounded-lg text-xs ${
                    message.role === "assistant" ? "bg-[#4A90E2] text-white" : "bg-[#E5E5EA] text-black"
                  }`}
                  style={{ padding: "12px", margin: "8px 0" }}
                >
                  {message.text}
                </div>
                {message.role === "assistant" && message.results?.length ? (
                  <div className="mt-2 grid gap-2">
                    {message.results.map((result) => (
                      <article key={`chat-result-${result.id}`} className="rounded-md border border-[#d8e5f8] bg-white px-3 py-2 text-left">
                        <p className="text-xs font-semibold text-[#1a2b44]">{result.name}</p>
                        <p className="text-[11px] text-[#5f7590]">
                          Country: {result.country}
                          {result.state ? `, ${result.state}` : ""}
                          {result.city ? `, ${result.city}` : ""}
                        </p>
                        {result.courseCategory ? (
                          <p className="text-[11px] text-[#5f7590]">Category: {result.courseCategory}</p>
                        ) : null}
                        {result.degreeLevel ? (
                          <p className="text-[11px] text-[#5f7590]">Degree: {result.degreeLevel}</p>
                        ) : null}
                        {result.ieltsMin !== null && result.ieltsMin !== undefined ? (
                          <p className="text-[11px] text-[#5f7590]">IELTS ≥ {result.ieltsMin}</p>
                        ) : null}
                        {result.satRequired !== undefined ? (
                          <p className="text-[11px] text-[#5f7590]">
                            SAT: {result.satRequired ? `Required${result.satMin ? ` (≥${result.satMin})` : ""}` : "Not required"}
                          </p>
                        ) : null}
                        <p className="text-[11px] text-[#5f7590]">{result.tuition}</p>
                      </article>
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
    </>
  );
}
