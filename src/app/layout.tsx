// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, EB_Garamond, Quicksand } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interfaceFont = Quicksand({
  subsets: ["latin"],
  variable: "--font-interface",
  display: "swap",
});

const storyFont = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-story",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tailored Tale",
  description: "Gepersonaliseerde bedtijdverhaaltjes op maat gemaakt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} ${interfaceFont.variable} ${storyFont.variable}`}
    >
      <body className="antialiased font-[var(--font-interface)]">{children}</body>
    </html>
  );
}
