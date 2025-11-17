"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettingsDrawer } from "./SettingsDrawerContext";

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openSettings } = useSettingsDrawer();
  return (
    <header className="border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-0">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Grip State Lab
        </Link>
        <button
          aria-label="Abrir menú"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-2xl border px-3 py-2 text-sm font-semibold transition text-neutral-200 sm:hidden"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
            backgroundColor: mobileOpen ? "rgba(255,255,255,0.12)" : "transparent",
          }}
        >
          ☰
        </button>
        <nav className="hidden items-center gap-4 text-sm font-medium text-neutral-300 sm:flex">
          <Link href="/" className="rounded-full px-3 py-1 transition hover:text-white">
            Home
          </Link>
          <Link
            href="/bjj"
            className="rounded-full bg-white/95 px-4 py-2 text-neutral-900 shadow hover:bg-white"
          >
            Jugar ahora
          </Link>
          <button
            onClick={openSettings}
            className="rounded-full border border-white/20 px-3 py-1 text-neutral-200 transition hover:text-white"
          >
            Ajustes
          </button>
        </nav>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/10 bg-neutral-950 px-6 py-4 text-sm sm:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-white/15 px-4 py-2 text-center text-neutral-200"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/bjj"
              className="rounded-2xl bg-white/95 px-4 py-2 text-center font-semibold text-neutral-900"
              onClick={() => setMobileOpen(false)}
            >
              Jugar ahora
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                openSettings();
              }}
              className="rounded-2xl border border-white/15 px-4 py-2 text-center text-neutral-200"
            >
              Ajustes
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
