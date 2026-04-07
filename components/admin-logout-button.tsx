"use client";

export function AdminLogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-aura-ink transition hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
    >
      Sign out
    </button>
  );
}
