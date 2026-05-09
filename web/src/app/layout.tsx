import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIAI InsightHub",
  description: "Community-driven course intelligence for the Master of Interdisciplinary AI program.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <header className="glass sticky top-0 z-50 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/uottawa-logo-white.png" 
              alt="uOttawa Logo" 
              width={140} 
              height={40} 
              className="object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="h-6 w-px bg-white/20 mx-1"></div>
            <div className="font-bold text-xl tracking-tight">
              MIAI <span className="text-gradient">InsightHub</span>
            </div>
          </Link>
          <nav>
            {/* Nav items will go here */}
          </nav>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
