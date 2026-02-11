"use client";

import { useMemo, useState } from "react";
import type { UniversityRecommendation } from "@/lib/api/recommendation";

type Message = {
  role: "bot" | "user";
  text: string;
};

const starterMessages: Message[] = [
  {
    role: "bot",
    text: "Hi! I am your AI UniGuide helper. Ask about countries, courses, tuition, or top match.",
  },
];

const normalize = (value: string) => value.toLowerCase().trim();

export default function AIChatbot({ universities }: { universities: UniversityRecommendation[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(starterMessages);

  const topMatch = useMemo(() => {
    if (!universities.length) return null;
    return [...universities].sort((a, b) => Number(b.score.replace("%", "")) - Number(a.score.replace("%", "")))[0];
  }, [universities]);

  const countrySet = useMemo(() => Array.from(new Set(universities.map((u) => u.country))), [universities]);
  const courseSet = useMemo(() => Array.from(new Set(universities.map((u) => u.program))), [universities]);

  const generateReply = (rawQuestion: string) => {
    const q = normalize(rawQuestion);
    if (!q) return "Please type a question.";

    if (q.includes("top") || q.includes("best") || q.includes("match")) {
      if (!topMatch) return "I could not find recommendations yet.";
      return `Top match right now is ${topMatch.name} (${topMatch.program}, ${topMatch.country}) with ${topMatch.score} fit.`;
    }

    if (q.includes("country") || q.includes("countries")) {
      return `Available countries: ${countrySet.slice(0, 12).join(", ")}${countrySet.length > 12 ? "..." : ""}`;
    }

    if (q.includes("course") || q.includes("program")) {
      return `Popular courses: ${courseSet.slice(0, 12).join(", ")}${courseSet.length > 12 ? "..." : ""}`;
    }

    if (q.includes("tuition") || q.includes("fee") || q.includes("cost")) {
      const low = [...universities].sort((a, b) => a.tuition.localeCompare(b.tuition))[0];
      if (!low) return "No tuition data found.";
      return `Tuition varies by university. One example is ${low.name}: ${low.tuition}.`;
    }

    const found = universities.find((u) => normalize(`${u.name} ${u.program} ${u.country}`).includes(q));
    if (found) {
      return `${found.name} in ${found.country} offers ${found.program}. Tuition: ${found.tuition}. Intake: ${found.intake}.`;
    }

    return "Try asking: 'top match', 'which countries?', 'popular courses', or type a university name.";
  };

  const send = () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input.trim() };
    const botMessage: Message = { role: "bot", text: generateReply(input.trim()) };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[320px] rounded-[10px] border border-[#4A90E2]/30 bg-white shadow-[0_12px_30px_rgba(74,144,226,0.25)]">
          <div className="flex items-center justify-between rounded-t-[10px] bg-[#4A90E2] px-4 py-3 text-white">
            <p className="text-sm font-bold">AI UniGuide Chatbot</p>
            <button onClick={() => setOpen(false)} className="text-xs font-semibold uppercase">
              Close
            </button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto p-3">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`rounded-[8px] px-3 py-2 text-sm ${
                  msg.role === "bot" ? "bg-[#eef5ff] text-[#333333]" : "bg-[#F5A623]/20 text-[#333333]"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-[#e6edf9] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Ask about universities..."
              className="h-10 flex-1 rounded-[8px] border border-[#c7d9f5] px-3 text-sm outline-none focus:ring-2 focus:ring-[#4A90E2]/30"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-[8px] bg-[#4A90E2] px-3 text-sm font-semibold text-white hover:bg-[#357ABD]"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-[8px] bg-[#4A90E2] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(74,144,226,0.35)] hover:bg-[#357ABD]"
        >
          AI Chat
        </button>
      )}
    </div>
  );
}
