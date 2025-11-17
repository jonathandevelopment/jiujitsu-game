import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteNav from "@/components/SiteNav";
import { SettingsDrawerProvider } from "@/components/SettingsDrawerContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BJJ Mini-Game",
  description: "Entrená reflejos de jiujitsu desde tu navegador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-50`}
      >
        <SettingsDrawerProvider>
          <div className="flex min-h-screen flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </SettingsDrawerProvider>
      </body>
    </html>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/90 py-6 text-sm text-neutral-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 sm:flex-row sm:px-10 lg:px-0">
        <p>© {new Date().getFullYear()} Grip State Lab. Todos los rolles reservados.</p>
        <div className="flex gap-4">
          <a href="mailto:hello@bjj.gg" className="transition hover:text-white">
            Contacto
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
