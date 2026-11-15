import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/app/app-shell";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

// The theme's two families: Inter for everything, JetBrains Mono for formulas and key chips.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Guitar Notes", template: "%s · Guitar Notes" },
  description: "A personal guitar study companion: theory, scales, modes, voicings, arpeggios, improvisation and guided practice.",
  // A private study tool, not a public site.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    // --background in each theme, as hex (browser UI chrome doesn't take oklch everywhere).
    { media: "(prefers-color-scheme: light)", color: "#fbfdfc" },
    { media: "(prefers-color-scheme: dark)", color: "#050f0d" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
