"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I can help with services, specialists, appointments, and clinic questions."
    }
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    panelRef.current?.scrollTo({
      top: panelRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: message }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const payload = (await response.json()) as { reply?: string; message?: string };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.reply || payload.message || "Please try again in a moment."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Chat is temporarily unavailable. Please try again in a moment."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-10 right-4 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="premium-card w-[min(92vw,24rem)] overflow-hidden rounded-[1.75rem] border border-[#1B4332]/12 bg-white/95 shadow-[0_22px_60px_rgba(27,67,50,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(14,31,25,0.98),rgba(16,36,28,0.96))]">
          <div className="flex items-center justify-between border-b border-[#1B4332]/8 px-5 py-3 dark:border-white/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2D6A4F] dark:text-[#95D5B2]">Aura Chat</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[#1B4332]/60 transition hover:bg-[#1B4332]/5 hover:text-[#1B4332] dark:text-[#F5F0E8]/68 dark:hover:bg-white/8 dark:hover:text-[#F5F0E8]"
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={panelRef} className="max-h-[20rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-[1.25rem] px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-[#F5F0E8] text-[#1B4332] dark:bg-white/[0.08] dark:text-[#F5F0E8]"
                    : "ml-auto bg-[#1B4332] text-[#F5F0E8] dark:bg-[#95D5B2] dark:text-[#0f241b]"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-[#1B4332]/8 px-4 py-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about specialists or appointments"
                className="light-input !rounded-full !px-4 !py-2.5 !text-sm"
                aria-label="Chat message"
              />
              <button type="submit" disabled={loading} className="primary-button !px-4 !py-2.5 !text-sm !text-[#F5F0E8] dark:!bg-[#95D5B2] dark:!text-[#10211a]">
                {loading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close AI Chat" : "Open AI Chat"}
        className="inline-flex items-center gap-2 rounded-full bg-[#1B4332] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5F0E8] shadow-[0_12px_32px_rgba(27,67,50,0.28)] transition hover:-translate-y-0.5 hover:scale-[1.03] dark:bg-[#95D5B2] dark:text-[#10211a] sm:gap-3 sm:px-5 sm:py-4 sm:text-sm"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/12 text-xs dark:bg-black/10 sm:h-9 sm:w-9 sm:text-sm">AI</span>
        <span>Chat</span>
      </button>
    </div>
  );
}
