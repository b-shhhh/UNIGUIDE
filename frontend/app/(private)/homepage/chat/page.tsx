"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: "user", content: input }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history: messages }),
    });
    const data = (await res.json()) as { answer: string; results?: Array<{ id: string; name: string; country: string }> };
    setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    setLoading(false);
    if (data.results && data.results.length) {
      // Auto navigate to first result on click
      const first = data.results[0];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Top match: ${first.name} (${first.country}). Click to view.`,
        },
      ]);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">AI Chatbot</p>
          <h1 className="text-xl font-bold text-slate-900">Ask about countries, courses, universities</h1>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-xl rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-indigo-600 text-white" : "bg-white text-slate-800 shadow"}`}>
            {m.content}
            {m.role === "assistant" && m.content.includes("Top match") ? (
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 underline"
                onClick={() => {
                  const id = m.content.match(/id: ([^ )]+)/)?.[1];
                  if (id) router.push(`/homepage/universities/${id}`);
                }}
              >
                View details
              </button>
            ) : null}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., cheap data science programs in Canada with IELTS 6.5"
          className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading}
          className="h-11 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
