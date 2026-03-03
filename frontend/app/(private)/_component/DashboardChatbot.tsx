// components/DashboardChatbot.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AcademicCapIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface Message {
  sender: "user" | "bot";
  text: string;
  universities?: UniCard[];
}

interface UniCard {
  id: string;
  name: string;
  country: string;
  degreeLevels: string[];
  ieltsMin: number | null;
  satRequired: boolean | null;
  satMin: number | null;
}

const DashboardChatbot = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiBase =
        (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(
          /\/$/,
          ""
        );
      const url = apiBase ? `${apiBase}/api/chatbot` : "/api/chatbot";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`Chatbot request failed: ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = {
        sender: "bot",
        text: data.reply,
        universities: Array.isArray(data.universities) ? data.universities : []
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: Message = { sender: "bot", text: "Something went wrong. Please try again later." };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 md:right-8 bottom-6 md:bottom-8 h-14 w-14 rounded-full bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] border border-[#0E6F86]/30 shadow-xl flex items-center justify-center hover:shadow-2xl transition-all"
          aria-label="Open chatbot"
        >
          <AcademicCapIcon className="h-7 w-7 text-white" />
        </button>
      )}

      {open && (
        <div className="fixed right-4 md:right-8 bottom-4 md:bottom-8 w-[360px] max-w-[92vw] max-h-[78vh] bg-white shadow-2xl rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] text-white">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold">UniGuide Assistant</p>
                <p className="text-[11px] opacity-80">Ask about universities, courses, IELTS/SAT</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close chatbot"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gradient-to-br from-[#0E6F86] via-[#18809a] to-[#1F6F8B]">
            {messages.length === 0 && (
              <div className="text-sm text-white/85">
                Try: “Universities in Canada that accept IELTS 6.5” or “MBA in Germany with SAT optional”.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "ml-auto bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] text-white"
                    : "mr-auto bg-white/90 border border-white/60 text-slate-900 backdrop-blur"
                }`}
              >
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}

                {msg.universities && msg.universities.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.universities.map((uni) => (
                      <button
                        key={uni.id || uni.name}
                        onClick={() => uni.id && router.push(`/homepage/universities/${encodeURIComponent(uni.id)}`)}
                className="w-full text-left border border-white/60 bg-white/90 hover:border-white transition rounded-xl px-3 py-2 backdrop-blur"
                        disabled={!uni.id}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{uni.name}</span>
                          <span className="text-xs text-slate-500">{uni.country}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Degrees: {uni.degreeLevels?.length ? uni.degreeLevels.join(", ") : "N/A"}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex gap-3">
                          <span>IELTS: {uni.ieltsMin ?? "N/A"}</span>
                          <span>
                            SAT:{" "}
                            {uni.satRequired === true
                              ? uni.satMin ?? "N/A"
                              : uni.satRequired === false
                              ? "optional"
                              : "N/A"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-white/40 bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] px-3 py-3">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 border border-white/60 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white/80"
                placeholder="Ask about country, course, IELTS/SAT…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              <button
                className="bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardChatbot;
