// components/DashboardChatbot.tsx
"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const DashboardChatbot = () => {
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
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg: Message = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: Message = { sender: "bot", text: "Oops! Something went wrong." };
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
      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform duration-150 flex items-center justify-center"
          aria-label="Open chatbot"
        >
          <span className="text-2xl" aria-hidden>
            🎓
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[92vw] h-[520px] bg-white shadow-2xl rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                🎓
              </span>
              <div className="leading-tight">
                <p className="font-semibold">UniGuide Assistant</p>
                <p className="text-xs opacity-80">Ask about universities, courses, IELTS/SAT</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-xl leading-none px-2"
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-sm text-slate-500">
                Try: “Universities in Canada that accept IELTS 6.5” or “MBA in Germany with SAT optional”.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-white border border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ask about country, course, IELTS/SAT…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
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
