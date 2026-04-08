import { Inter, Playfair_Display } from "next/font/google";
import dynamic from "next/dynamic";

import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import "./globals.css";

const ChatWidget = dynamic(() => import("../components/chat-widget").then((m) => ({ default: m.ChatWidget })), {
  ssr: false
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  title: "Aura Health — Clinical Sanctuary",
  description: "A premium clinical sanctuary with patient booking, dashboards, and staff operations. Precision medicine, staged like hospitality.",
  openGraph: {
    title: "Aura Health — Clinical Sanctuary",
    description: "Precision medicine, staged like hospitality. Book specialist consultations and experience a premium standard of care.",
    siteName: "Aura Health",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Health — Clinical Sanctuary",
    description: "Precision medicine, staged like hospitality."
  },
  icons: {
    icon: ["/favicon.ico", "/favicon.svg"],
    apple: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const stored = localStorage.getItem("aura-theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const isDark = stored ? stored === "dark" : prefersDark;
                  document.documentElement.classList.toggle("dark", isDark);
                } catch {}
              })();
            `
          }}
        />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
