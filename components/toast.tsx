"use client";

type ToastProps = {
  message: string;
  tone?: "success" | "error" | "info";
};

const toneClasses: Record<NonNullable<ToastProps["tone"]>, string> = {
  success: "border-[#95D5B2] bg-[#2D6A4F] text-white",
  error: "border-red-200 bg-red-600 text-white",
  info: "border-[#95D5B2] bg-[#1B4332] text-white"
};

const toneIcons: Record<NonNullable<ToastProps["tone"]>, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ"
};

export function Toast({ message, tone = "info" }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-[100] max-w-sm toast-enter" role="alert">
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur-sm ${toneClasses[tone]}`}>
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20 text-xs font-bold" aria-hidden="true">
          {toneIcons[tone]}
        </span>
        {message}
      </div>
    </div>
  );
}
